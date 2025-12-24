---
password: "8353c129-00fe-4174-a1bf-096160d9b09f"
---

# Debug of PA4-3

这是我在实现 NEMU 时遇到的最后一个，也是问题最大的 bug

```c hl_lines="21"
NEMU load and execute img: ./kernel/kernel.img  elf: ./game/game
[src/main.c,82,init_cond] {kernel} Hello, NEMU world!
[src/elf/elf.c,27,loader] {kernel} ELF loading from hard disk.
[src/common/main.c,19,game_init] {game} game start!
[src/nemu-pal/main.c,114,PAL_Init] {game} VIDEO_Init success
[src/nemu-pal/global/global.c,68,PAL_InitGlobals] {game} loading fbp.mkf
[src/nemu-pal/global/global.c,70,PAL_InitGlobals] {game} loading mgo.mkf
[src/nemu-pal/global/global.c,72,PAL_InitGlobals] {game} loading ball.mkf
[src/nemu-pal/global/global.c,74,PAL_InitGlobals] {game} loading data.mkf
[src/nemu-pal/global/global.c,76,PAL_InitGlobals] {game} loading f.mkf
[src/nemu-pal/global/global.c,78,PAL_InitGlobals] {game} loading fire.mkf
[src/nemu-pal/global/global.c,80,PAL_InitGlobals] {game} loading rgm.mkf
[src/nemu-pal/global/global.c,82,PAL_InitGlobals] {game} loading sss.mkf
[src/nemu-pal/global/global.c,85,PAL_InitGlobals] {game} loading desc.dat
[src/nemu-pal/main.c,122,PAL_Init] {game} PAL_InitGolbals success
[src/nemu-pal/main.c,129,PAL_Init] {game} PAL_InitFont success
[src/nemu-pal/main.c,136,PAL_Init] {game} PAL_InitUI success
[src/nemu-pal/main.c,143,PAL_Init] {game} PAL_InitText success
[src/nemu-pal/main.c,146,PAL_Init] {game} PAL_InitInput success
[src/nemu-pal/main.c,148,PAL_Init] {game} PAL_InitResources success
nemu: src/memory/mmu/page.c:54: page_translate: Assertion `pte.present' failed.
```

最终实现的 NEMU-PAL 移植能够加载初始界面，但是在加载新的场景时（可能是主菜单）出现了 `pte.present == 0` 的情况

根据 NEMU 手册所述：

> 在NEMU中，我们不会发生缺页的情况，因此，在进行`page_translate()`时，建议添加对页目录项和页表项中`present==1`的检查，若出现`present`为0，则一定是页级地址转换出了问题。若不做相应检查，代码可能会变得非常难以调试。

所以这是非预期行为

触发点：

```c hl_lines="15 16 17"
paddr_t page_translate(laddr_t laddr)
{
#ifndef TLB_ENABLED
    uint32_t dir = (laddr >> 22) & 0x3ff;
    uint32_t page = (laddr >> 12) & 0x3ff;
    uint32_t offset = laddr & 0xfff;
    
    uint32_t pde_addr = (cpu.cr3.pdbr << 12) + (dir << 2);
    PDE pde;
    pde.val = paddr_read(pde_addr, 4);

    assert(pde.present == 1);

    uint32_t pte_addr = (pde.page_frame << 12) + (page << 2);
    PTE pte;
    pte.val = paddr_read(pte_addr, 4);
	assert(pte.present);	/* This assertion failed */
    
    return (pte.page_frame << 12) | offset;
#else    
    return tlb_read(laddr) | (laddr & PAGE_MASK);
#endif
    return -1;
}
```

在 Line 15 定义的 `pte`，紧接着进行 `paddr_read` 写操作，接下来就出现了相关的断言失败

切换到了官方框架的 TLB 实现依旧出现相同的断言失败，于是排除 `page_translate` 的问题

看上去会是 `paddr_read` 的问题

```c hl_lines="3 4 5 6 7 8 9"
uint32_t paddr_read(paddr_t paddr, size_t len) 
{
	uint32_t ret = 0;
#ifdef HAS_DEVICE_VGA
    int map_NO = is_mmio(paddr);
    if(map_NO != -1){
        ret = mmio_read(paddr, len, map_NO);
        return ret;
    }
#endif
#ifdef CACHE_ENABLED
	ret = cache_read(paddr, len);
#else
	ret = hw_mem_read(paddr, len);
#endif
	return ret;
}
```

按照目前的宏定义只会有 `mmio` 相关的操作，在 `mmio.c` 中（这部分代码是官方框架的）：

```c
/* bus interface */
int is_mmio(uint32_t addr)
{
	int i;
	for (i = 0; i < nr_map; i++)
	{
		if (addr >= maps[i].low && addr <= maps[i].high)
		{
			return i;
		}
	}
	return -1;
}

uint32_t mmio_read(uint32_t addr, size_t len, int map_NO)
{
	assert(len == 1 || len == 2 || len == 4);
	MMIO_t *map = &maps[map_NO];
	uint32_t data = *(uint32_t *)(map->mmio_space + (addr - map->low)) & (~0u >> ((4 - len) << 3));
	map->callback(addr, len, false);
	return data;
}
```

应该不会是官方框架的问题，我考虑在断言错误发生之前打印一些错误调试信息：

调试信息框架由 AI 提供

```c
PTE pte;
pte.val = paddr_read(pte_addr, 4);
if(pte.present == 0){
    printf("\n=== PTE PRESENT ASSERTION FAILED ===\n");
    
    // 基本上下文
    printf("EIP = 0x%08x\n", cpu.eip);
    printf("线性地址 = 0x%08x\n", laddr);
    printf("  页目录索引 = %d, 页表索引 = %d, 偏移 = 0x%03x\n", dir, page, offset);
    
    // CR3和PDE信息
    printf("CR3.pdbr = 0x%02x (页目录物理地址: 0x%05x000)\n", cpu.cr3.pdbr, cpu.cr3.pdbr);
    printf("PDE地址 = 0x%08x, PDE值 = 0x%08x\n", pde_addr, pde.val);
    printf("  present=%d, page_frame=0x%05x\n", pde.present, pde.page_frame);
    
    // 完整的PTE信息
    printf("PTE地址 = 0x%08x, PTE值 = 0x%08x\n", pte_addr, pte.val);
    printf("PTE详细位信息:\n");
    printf("  present=%d\n", pte.present);
    printf("  read_write=%d\n", pte.read_write);
    printf("  user_supervisor=%d\n", pte.user_supervisor);
    printf("  page_write_through=%d\n", pte.page_write_through);
    printf("  page_cache_disable=%d\n", pte.page_cache_disable);
    printf("  accessed=%d\n", pte.accessed);
    printf("  dirty=%d\n", pte.dirty);
    printf("  pad0=%d\n", pte.pad0);
    printf("  global=%d\n", pte.global);
    printf("  pad1=0x%x\n", pte.pad1);
    printf("  page_frame=0x%05x\n", pte.page_frame);
    
    // 页表完整性检查
    printf("页表 0x%05x000 的前几个PTE:\n", pde.page_frame);
    for (int i = 0; i < 6; i++) {
        uint32_t addr = (pde.page_frame << 12) + i * 4;
        uint32_t val = paddr_read(addr, 4);
        printf("  PTE[%d]: 0x%08x (present=%d)%s\n", 
               i, val, val & 1, i == page ? " <-- 访问的PTE" : "");
    }
    
    // 页目录状态
    printf("页目录前几个PDE:\n");
    for (int i = 0; i < 4; i++) {
        uint32_t addr = (cpu.cr3.pdbr << 12) + i * 4;
        uint32_t val = paddr_read(addr, 4);
        printf("  PDE[%d]: 0x%08x (present=%d)%s\n", 
               i, val, val & 1, i == dir ? " <-- 访问的PDE" : "");
    }
    
    printf("====================================\n");
    fflush(stdout);
}
assert(pte.present);	/* This assertion failed */  
```

给出了这样的结果

```c
=== PTE PRESENT ASSERTION FAILED ===
EIP = 0x08073f4d
线性地址 = 0x00000002
  页目录索引 = 0, 页表索引 = 0, 偏移 = 0x002
CR3.pdbr = 0x95 (页目录物理地址: 0x00095000)
PDE地址 = 0x00095000, PDE值 = 0x0004f007
  present=1, page_frame=0x0004f
PTE地址 = 0x0004f000, PTE值 = 0x00000000
PTE详细位信息:
  present=0
  read_write=0
  user_supervisor=0
  page_write_through=0
  page_cache_disable=0
  accessed=0
  dirty=0
  pad0=0
  global=0
  pad1=0x0
  page_frame=0x00000
页表 0x0004f000 的前几个PTE:
  PTE[0]: 0x00000000 (present=0) <-- 访问的PTE
  PTE[1]: 0x00000000 (present=0)
  PTE[2]: 0x00000000 (present=0)
  PTE[3]: 0x00000000 (present=0)
  PTE[4]: 0x00000000 (present=0)
  PTE[5]: 0x00000000 (present=0)
页目录前几个PDE:
  PDE[0]: 0x0004f007 (present=1) <-- 访问的PDE
  PDE[1]: 0x00000000 (present=0)
  PDE[2]: 0x00000000 (present=0)
  PDE[3]: 0x00000000 (present=0)
====================================

```

线性地址看上去没有问题，PDE 也很正常，但是 PTE 是完全空的（没有初始化）

所以我们现在定位到和创建页表相关的函数：

```c
// /kernel/src/elf/elf.c
uint32_t loader()
{
	Elf32_Ehdr *elf;
	Elf32_Phdr *ph, *eph;

#ifdef HAS_DEVICE_IDE
	uint8_t buf[4096];
	ide_read(buf, ELF_OFFSET_IN_DISK, 4096);
	elf = (void *)buf;
	Log("ELF loading from hard disk.");
#else
	elf = (void *)0x0;
	Log("ELF loading from ram disk.");
#endif

	/* Load each program segment */
	ph = (void *)elf + elf->e_phoff;
	eph = ph + elf->e_phnum;
	for (; ph < eph; ph++)
	{
		if (ph->p_type == PT_LOAD)
		{
			uint32_t file_sz = ph->p_filesz;
			uint32_t mem_sz = ph->p_memsz;

#ifdef IA32_PAGE
			uint8_t *dst = (uint8_t *)mm_malloc(ph->p_vaddr, ph->p_memsz);
#else
			uint8_t *dst = (uint8_t *)ph->p_vaddr;
#endif  


#ifdef HAS_DEVICE_IDE
			ide_read(dst, ELF_OFFSET_IN_DISK + ph->p_offset, ph->p_filesz);
#else
			uint8_t *src = (uint8_t *)elf + ph->p_offset;
			memcpy(dst, src, file_sz);
#endif

			if (mem_sz > file_sz) {
				memset(dst + file_sz, 0, mem_sz - file_sz);
			}

#ifdef IA32_PAGE
			/* Record the program break for future use */
			extern uint32_t brk;
			uint32_t new_brk = ph->p_vaddr + ph->p_memsz - 1;
			if (brk < new_brk)
			{
				brk = new_brk;
			}
#endif
		}
	}

	volatile uint32_t entry = elf->e_entry;

#ifdef IA32_PAGE
	mm_malloc(KOFFSET - STACK_SIZE, STACK_SIZE);
#ifdef HAS_DEVICE_VGA
	create_video_mapping();

#endif
	write_cr3(get_ucr3());
#endif
	return entry;
}
```

`create_video_mapping()` 函数用于建立显存的映射，插桩后发现程序在 ELF 装载时进行了唯一一次执行（预期）

```c hl_lines="2"
void create_video_mapping() {
	Log("create_video_mapping working\n");
	// ...
```



```c hl_lines="3"
[src/main.c,82,init_cond] {kernel} Hello, NEMU world!
[src/elf/elf.c,27,loader] {kernel} ELF loading from hard disk.
[src/memory/vmem.c,16,create_video_mapping] {kernel} create_video_mapping working
[src/common/main.c,19,game_init] {game} game start!
... ...
```

个人感觉不会是 `create_video_mapping()` 函数导致的，因为这个函数只初始化建立显存的映射，如 TODO 注释所说

```c
	/* TODO: create an identical mapping from virtual memory area
	 * [0xa0000, 0xa0000 + SCR_SIZE) to physical memeory area
	 * [0xa0000, 0xa0000 + SCR_SIZE) for user program. You may define
	 * some page tables to create this mapping.
	 */
```

在之前的调试信息中，`laddr` 的值为 `0x2`，不属于显存

接下来注意到 `init_page` 函数，其初始化分页机制，为框架自带的代码：

```c
// kvm.c
/* set up page tables for kernel */
void init_page(void)
{
	CR0 cr0;
	CR3 cr3;
	PDE *pdir = (PDE *)va_to_pa(kpdir);
	PTE *ptable = (PTE *)va_to_pa(kptable);
	uint32_t pdir_idx, ptable_idx, pframe_idx;

	/* make all PDE invalid */
	memset(pdir, 0, NR_PDE * sizeof(PDE));

	/* fill PDEs and PTEs */
	pframe_idx = 0;
	for (pdir_idx = 0; pdir_idx < PHY_MEM / PT_SIZE; pdir_idx++)
	{
		pdir[pdir_idx].val = make_pde(ptable);
		pdir[pdir_idx + KOFFSET / PT_SIZE].val = make_pde(ptable);
		for (ptable_idx = 0; ptable_idx < NR_PTE; ptable_idx++)
		{
			ptable->val = make_pte(pframe_idx << 12);
			pframe_idx++;
			ptable++;
		}
	}

	/* make CR3 to be the entry of page directory */
	cr3.val = 0;
	cr3.page_directory_base = ((uint32_t)pdir) >> 12;
	write_cr3(cr3.val);

	/* set PG bit in CR0 to enable paging */
	cr0.val = read_cr0();
	cr0.paging = 1;
	write_cr0(cr0.val);
}
```

---

鸽了，考完期中再补