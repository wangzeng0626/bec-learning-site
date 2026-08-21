/* ============================================================
   猎头新人特训营 — 交互脚本 v2
   - 侧边栏导航滚动高亮 (scrollspy)
   - 顶部搜索：关键词过滤并高亮 + 命中计数
   - 移动端抽屉
   - 阅读进度条
   - 自动章节目录（每章 h3 速览）
   - 面包屑（当前章节位置）
   - 上下翻页导航
   - FAQ 问题速查中心：按阶段筛选
   - 回到顶部
   ============================================================ */
(function () {
  "use strict";

  const main = document.querySelector(".main");
  const legacyTargets = {
    "#faq-hub": "#faq-center",
    "#ipo-valuation": "#skill-industry",
    "#logic-map": "#sop-flow",
  };
  Object.entries(legacyTargets).forEach(([from, to]) => {
    document.querySelectorAll(`a[href="${from}"]`).forEach((link) => {
      if (from === "#logic-map" && link.closest(".quicknav")) {
        link.remove();
        return;
      }
      link.setAttribute("href", to);
    });
  });
  ["faq-hub", "ipo-valuation", "logic-map"].forEach((id) => {
    document.getElementById(id)?.remove();
  });

  const readingOrder = [
    "home", "process-catalog", "sop-flow",
    "client-analysis", "skill-deconstruct", "skill-industry",
    "skill-embodied", "skill-llm", "skill-fde",
    "sop-search", "exec-mapping", "sop-channel", "resume",
    "skill-firstcall", "sop-call", "skill-candidate", "rel-refer",
    "sop-recommend", "sop-interview", "sop-offer", "sop-onboard",
    "sop-payment", "sop-guarantee", "skill-bd", "client-dev",
    "culture", "essence", "faq-center", "deliverables", "tools",
    "path", "week1", "week24", "month23", "mentor", "risk",
    "cases-win", "cases-fail", "cases-review"
  ];
  if (main) {
    readingOrder.forEach((id) => {
      const section = document.getElementById(id);
      if (section) main.appendChild(section);
    });
  }

  function collapseResearchTail(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    const start = Array.from(section.children).find(
      (element) =>
        element.tagName === "H3" && element.textContent.includes("一、赛道速写")
    );
    if (!start) return;
    const details = document.createElement("details");
    details.className = "research-more";
    const summary = document.createElement("summary");
    summary.textContent = "完整人才地图、岗位细节和案例（需要时再展开）";
    details.appendChild(summary);
    section.insertBefore(details, start);
    let current = start;
    while (current) {
      const next = current.nextElementSibling;
      details.appendChild(current);
      current = next;
    }
  }

  collapseResearchTail("skill-embodied");
  collapseResearchTail("skill-llm");

  const sectionTitles = {
    "process-catalog": "流程目录",
    "sop-flow": "做单流程",
    "client-analysis": "客户分析",
    "skill-deconstruct": "岗位解构",
    "skill-industry": "行业研究",
    "skill-embodied": "具身智能",
    "skill-llm": "大模型",
    "skill-fde": "FDE",
    "sop-search": "寻访",
    "exec-mapping": "高管寻访",
    "sop-channel": "渠道",
    resume: "简历判断",
    "skill-firstcall": "电话准备",
    "sop-call": "电话沟通",
    "skill-candidate": "候选人判断",
    "rel-refer": "候选人关系",
    "sop-recommend": "推荐",
    "sop-interview": "面试管理",
    "sop-offer": "Offer",
    "sop-onboard": "入职跟进",
    "sop-payment": "回款",
    "sop-guarantee": "保证期",
    "skill-bd": "BD 电话",
    "client-dev": "客户开发",
    culture: "团队协作",
    essence: "职业能力",
    "faq-center": "问题速查",
    deliverables: "交付物",
    tools: "工具与模板",
    path: "90 天训练",
    week1: "第 1 周",
    week24: "第 2—4 周",
    month23: "第 2—3 月",
    mentor: "导师带教",
    risk: "风控",
    "cases-win": "成功案例",
    "cases-fail": "失败案例",
    "cases-review": "复盘模板",
  };
  Object.entries(sectionTitles).forEach(([id, title]) => {
    const section = document.getElementById(id);
    const heading = section?.querySelector(":scope > h2");
    if (heading) heading.textContent = title;
  });

  const chapterTocLabels = {
    "client-analysis": ["公司现在处于什么阶段", "接单前要查哪些信息", "这单是否值得投入", "谁是真正拍板的人", "怎么确认决策人", "面对不同人怎么沟通", "招聘节奏怎么确认", "怎样维护客户", "什么情况要暂停"],
    "skill-deconstruct": ["开始前要补哪些背景", "这个人来解决什么问题", "岗位画像怎么写", "怎么挖出真实需求", "目标公司从哪里来", "电话里要验证什么", "智能硬件岗怎么拆"],
    "skill-industry": ["什么情况下需要研究", "长期激励怎么判断", "陌生行业怎么看", "人才地图怎么画", "跨行业人怎么判断"],
    "skill-embodied": ["具身智能现在走到哪了", "从 Demo 到量产要过什么关", "公司靠什么赚钱", "真正的竞争壁垒", "商业化卡在哪里", "美国公司怎么走"],
    "skill-llm": ["大模型行业现在在哪一段", "公司靠什么赚钱", "真正的竞争壁垒", "商业化卡在哪里", "美国公司怎么走"],
    "sop-flow": ["一单从哪里开始", "每一步怎么判断能不能往下走", "接单前三天先做什么", "各阶段转化率怎么看"],
  };

  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  const menuBtn = document.getElementById("menuBtn");
  const searchInput = document.getElementById("searchInput");
  const clearBtn = document.getElementById("searchClear");
  const links = Array.from(document.querySelectorAll(".nav-link"));
  const sections = links
    .map((l) => document.getElementById(l.getAttribute("href").slice(1)))
    .filter(Boolean);

  /* ---------- 移动端抽屉 ---------- */
  function closeDrawer() {
    sidebar.classList.remove("open");
    overlay.classList.remove("show");
  }
  if (menuBtn) {
    function toggleDrawer(e) {
      e.preventDefault();
      e.stopPropagation();
      sidebar.classList.toggle("open");
      overlay.classList.toggle("show");
    }
    menuBtn.addEventListener("click", toggleDrawer);
    menuBtn.addEventListener("touchend", toggleDrawer, { passive: false });
  }
  if (overlay) overlay.addEventListener("click", closeDrawer);
  links.forEach((l) => l.addEventListener("click", closeDrawer));

  /* ---------- Scrollspy ---------- */
  const byId = {};
  links.forEach((l) => (byId[l.getAttribute("href").slice(1)] = l));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach((l) => l.classList.remove("active"));
          const active = byId[entry.target.id];
          if (active) active.classList.add("active");
        }
      });
    },
    { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
  );
  sections.forEach((s) => observer.observe(s));

  /* ---------- 阅读进度条 ---------- */
  const progressWrap = document.createElement("div");
  progressWrap.className = "progressbar";
  const progressBar = document.createElement("div");
  progressBar.className = "bar";
  progressWrap.appendChild(progressBar);
  document.body.appendChild(progressWrap);

  function updateProgress() {
    const doc = document.documentElement;
    const total = doc.scrollHeight - window.innerHeight;
    const pct = total > 0 ? (window.scrollY / total) * 100 : 0;
    progressBar.style.width = pct + "%";
  }
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  /* ---------- 回到顶部 ---------- */
  const toTop = document.createElement("button");
  toTop.className = "totop";
  toTop.setAttribute("aria-label", "回到顶部");
  toTop.innerHTML = "↑";
  toTop.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );
  document.body.appendChild(toTop);
  window.addEventListener(
    "scroll",
    () => {
      toTop.classList.toggle("show", window.scrollY > 480);
    },
    { passive: true }
  );

  /* ============================================================
     自动增强：面包屑 + 章节目录 + 上下翻页
     ============================================================ */
  // 侧栏分组映射：group-title -> 组内 nav-link
  const groups = [];
  document.querySelectorAll(".nav-group").forEach((g) => {
    const gt = g.querySelector(".group-title");
    if (!gt) return;
    const items = Array.from(g.querySelectorAll(".nav-link")).map((a) => ({
      href: a.getAttribute("href"),
      text: a.textContent.replace(/\s+/g, " ").trim(),
    }));
    groups.push({ title: gt.textContent.trim(), items });
  });

  // 全局章节顺序（侧栏出现顺序），用于翻页
  const cleanTxt = (t) =>
    t
      .replace(/^[0-9０-９]+/, "")
      .replace(/[\uD83C-\uDBFF\uDC00-\uDFFF\u2600-\u27BF\uFE0F]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  const flatOrder = [];
  groups.forEach((g) =>
    g.items.forEach((it) =>
      flatOrder.push({ href: it.href, text: cleanTxt(it.text) })
    )
  );

  function findGroupFor(href) {
    for (const g of groups) {
      if (g.items.some((it) => it.href === href)) return g;
    }
    return null;
  }

  // 给每个 section 注入：面包屑 + 章节目录 + 翻页
  document.querySelectorAll("section.section[id]").forEach((sec) => {
    const id = sec.id;
    const href = "#" + id;

    /* --- 面包屑 --- */
    const g = findGroupFor(href);
    if (g) {
      const item = g.items.find((it) => it.href === href);
      if (item) {
        const crumb = document.createElement("div");
        crumb.className = "crumb";
        const cleanText = (t) =>
          t
            .replace(/^[0-9０-９]+/, "")
            .replace(/^\s*·\s*/, "")
            .replace(/[\uD83C-\uDBFF\uDC00-\uDFFF\u2600-\u27BF\uFE0F]/g, "")
            .replace(/\s+/g, " ")
            .trim();
        const gTitle = cleanText(g.title.replace(/^[一二三四五六七八九十]+、/, ""));
        crumb.innerHTML =
          '<a href="#home">🏠 手册</a>' +
          '<span class="sep">/</span>' +
          '<span class="g">' +
          gTitle +
          "</span>" +
          '<span class="sep">/</span>' +
          '<span class="here">' +
          cleanText(item.text) +
          "</span>";
        sec.insertBefore(crumb, sec.firstChild);
      }
    }

    /* --- 章节目录：取 section 直接子级 h3（最多 18 个）--- */
    const h3s = Array.from(sec.children).filter(
      (el) => el.tagName === "H3"
    );
      const tocLimit = 9;
    if (h3s.length >= 2 && id !== "home" && id !== "process-catalog") {
      h3s.slice(0, tocLimit).forEach((h, i) => {
        if (!h.id) h.id = id + "-t" + (i + 1);
      });
      // 目录项：剥离编号前缀（一、/1./A.）和 emoji，保留正文；长标题截断
      const cleanHead = (t) =>
        t
          .replace(/^[一二三四五六七八九十]+、/, "")
          .replace(/^\d+[\.、]\s*/, "")
          .replace(/^\s*[A-Z][\.、]\s*/, "")
          .replace(/^第[一二三四五六七八九十]+步[:：]?\s*/, "")
          .replace(/^Day\s*\d+\s*[·:：]\s*/, "")
          .replace(/[\uD83C-\uDBFF\uDC00-\uDFFF\u2600-\u27BF\uFE0F]/g, "")
          .replace(/\s+/g, " ")
          .trim();
      const compactHead = (t) => {
        const clean = cleanHead(t).replace(/^先/, "");
        return clean.split(/[：·（(]/)[0].trim();
      };
      const toc = document.createElement("div");
      toc.className = "chapter-toc";
      let chips = '<div class="toc-title">目录</div><div class="toc-chips">';
      h3s.slice(0, tocLimit).forEach((h, i) => {
        let txt = chapterTocLabels[id]?.[i] || compactHead(h.textContent);
        // 实战深化块单独标记
        const isDeep = h.textContent.includes("实战深化");
        if (isDeep) txt = "实战深化 · " + txt.replace(/^实战深化\s*[·:：]?\s*/, "");
        if (txt.length > 22) txt = txt.slice(0, 22) + "…";
        chips +=
          '<span class="toc-chip' +
          (isDeep ? " deep" : "") +
          '" data-target="' +
          id +
          "-t" +
          (i + 1) +
          '"><span class="toc-n">' +
          (i + 1) +
          "</span>" +
          txt +
          "</span>";
      });
      chips += "</div>";
      toc.innerHTML = chips;
      // 插到 h2 标题之后（crumb 之后是 h2，toc 放在 h2 后面）
      const h2 = sec.children[1] && sec.children[1].tagName === "H2" ? sec.children[1] : sec.firstChild;
      sec.insertBefore(toc, h2.nextSibling);
      toc.classList.add("show");
      toc.querySelectorAll(".toc-chip").forEach((c) =>
        c.addEventListener("click", () => {
          const target = document.getElementById(c.dataset.target);
          if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        })
      );
    }

    /* --- 上下翻页 --- */
    const idx = flatOrder.findIndex((it) => it.href === href);
    if (idx > -1) {
      const prev = flatOrder[idx - 1];
      const next = flatOrder[idx + 1];
      if (prev || next) {
        const pager = document.createElement("div");
        pager.className = "pager";
        let html = "";
        if (prev) {
          html +=
            '<a href="' +
            prev.href +
            '" class="pg-prev"><span class="pg-dir">← 上一节</span><span class="pg-t">' +
            prev.text +
            "</span></a>";
        }
        if (next) {
          html +=
            '<a href="' +
            next.href +
            '" class="pg-next"><span class="pg-dir">下一节 →</span><span class="pg-t">' +
            next.text +
            "</span></a>";
        }
        if (!prev) html = html.replace('class="pg-next"', 'class="pg-next only"');
        pager.innerHTML = html;
        sec.appendChild(pager);
      }
    }
  });

  /* ---------- 章节悬浮目录：阅读时按需展开，不占正文空间 ---------- */
  const tocDock = document.createElement("div");
  tocDock.className = "toc-dock";
  tocDock.innerHTML =
    '<button class="toc-dock-trigger" type="button" aria-expanded="false">目录</button>' +
    '<div class="toc-dock-panel" aria-hidden="true"><div class="toc-dock-title">目录</div><div class="toc-dock-list"></div></div>';
  document.body.appendChild(tocDock);

  const tocDockTrigger = tocDock.querySelector(".toc-dock-trigger");
  const tocDockPanel = tocDock.querySelector(".toc-dock-panel");
  const tocDockTitle = tocDock.querySelector(".toc-dock-title");
  const tocDockList = tocDock.querySelector(".toc-dock-list");
  let activeTocSection = null;

  function closeTocDock() {
    tocDock.classList.remove("open");
    tocDockTrigger.setAttribute("aria-expanded", "false");
    tocDockPanel.setAttribute("aria-hidden", "true");
  }

  function setTocDock(section) {
    const toc = section.querySelector(":scope > .chapter-toc");
    if (!toc || activeTocSection === section) return;
    activeTocSection = section;
    tocDockTitle.textContent = section.querySelector("h2")?.textContent || "目录";
    tocDockList.innerHTML = toc.querySelector(".toc-chips").innerHTML;
    tocDock.classList.add("show");
    closeTocDock();
  }

  tocDockTrigger.addEventListener("click", () => {
    const open = tocDock.classList.toggle("open");
    tocDockTrigger.setAttribute("aria-expanded", String(open));
    tocDockPanel.setAttribute("aria-hidden", String(!open));
  });
  tocDockList.addEventListener("click", (event) => {
    const chip = event.target.closest(".toc-chip");
    if (!chip) return;
    const target = document.getElementById(chip.dataset.target);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    closeTocDock();
  });

  const tocObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setTocDock(entry.target);
      });
    },
    { rootMargin: "-18% 0px -70% 0px", threshold: 0 }
  );
  document.querySelectorAll("section.section[id]").forEach((section) => {
    if (section.querySelector(":scope > .chapter-toc")) tocObserver.observe(section);
  });

  /* ============================================================
     问题速查中心：阶段筛选
     ============================================================ */
  const hub = document.getElementById("faq-hub");
  if (hub) {
    const filterWrap = hub.querySelector(".hub-filter");
    const groupsAll = Array.from(hub.querySelectorAll(".hub-group"));
    const buttons = Array.from(filterWrap.querySelectorAll(".hf"));

    function applyFilter(key) {
      buttons.forEach((b) => b.classList.toggle("on", b.dataset.f === key));
      groupsAll.forEach((gr) => {
        const show = key === "all" || gr.dataset.stage === key;
        gr.style.display = show ? "" : "none";
      });
    }
    buttons.forEach((b) =>
      b.addEventListener("click", () => applyFilter(b.dataset.f))
    );
    applyFilter("all");
  }

  /* ---------- 搜索过滤 + 高亮 ---------- */
  let timer = null;
  function clearMarks(root) {
    root.querySelectorAll("mark").forEach((m) => {
      const parent = m.parentNode;
      parent.replaceChild(document.createTextNode(m.textContent), m);
      parent.normalize();
    });
  }

  function highlight(root, term) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    const textNodes = [];
    let n;
    while ((n = walker.nextNode())) {
      if (n.nodeValue.trim() && !/^\s*$/.test(n.nodeValue)) textNodes.push(n);
    }
    textNodes.forEach((node) => {
      const val = node.nodeValue;
      const idx = val.toLowerCase().indexOf(term);
      if (idx === -1) return;
      const frag = document.createDocumentFragment();
      let last = 0;
      let from = 0;
      while (true) {
        const i = val.toLowerCase().indexOf(term, from);
        if (i === -1) {
          frag.appendChild(document.createTextNode(val.slice(last)));
          break;
        }
        frag.appendChild(document.createTextNode(val.slice(last, i)));
        const mk = document.createElement("mark");
        mk.textContent = val.slice(i, i + term.length);
        frag.appendChild(mk);
        last = i + term.length;
        from = last;
      }
      node.parentNode.replaceChild(frag, node);
    });
  }

  function runSearch(term) {
    const sectionsAll = Array.from(document.querySelectorAll(".section"));
    if (!term) {
      sectionsAll.forEach((s) => (s.style.display = ""));
      document.querySelectorAll(".main, .main *").forEach((el) => clearMarks(el));
      return;
    }
    let hits = 0;
    sectionsAll.forEach((sec) => {
      // 先清除已有高亮
      clearMarks(sec);
      const text = sec.textContent.toLowerCase();
      if (text.includes(term)) {
        sec.style.display = "";
        highlight(sec, term);
        hits++;
      } else {
        sec.style.display = "none";
      }
    });
    const hint = document.getElementById("searchHint");
    if (hint) {
      hint.style.display = "block";
      hint.textContent =
        hits > 0 ? "找到 " + hits + " 个相关章节，关键词已高亮" : "没有找到相关内容，换个关键词试试";
    }
  }

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const v = this.value.trim().toLowerCase();
      clearBtn.style.display = v ? "block" : "none";
      clearTimeout(timer);
      timer = setTimeout(() => runSearch(v), 180);
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      searchInput.value = "";
      clearBtn.style.display = "none";
      const hint = document.getElementById("searchHint");
      if (hint) hint.style.display = "none";
      runSearch("");
      searchInput.focus();
    });
  }
  // 顶部加一个搜索命中提示条
  const hintEl = document.createElement("div");
  hintEl.id = "searchHint";
  hintEl.className = "search-hint";
  const sb = document.querySelector(".search-box");
  if (sb) sb.appendChild(hintEl);

  /* ============================================================
     v2.5 · 图表动画 / 数字滚动 / 模板复制
     ============================================================ */
  const revealIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          revealIO.unobserve(e.target);
        }
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -40px 0px" }
  );
  document
    .querySelectorAll(".funnel, .bchart, .statband, .tl90, .reveal")
    .forEach((el) => revealIO.observe(el));

  /* 数字滚动 */
  const countIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        countIO.unobserve(el);
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || "";
        if (isNaN(target)) {
          el.textContent = el.dataset.count + suffix;
          return;
        }
        const t0 = performance.now();
        const dur = 1100;
        const step = (t) => {
          const p = Math.min(1, (t - t0) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    },
    { threshold: 0.5 }
  );
  document.querySelectorAll("[data-count]").forEach((el) => countIO.observe(el));

  /* 模板复制 */
  function copyFallback(text, done) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      done();
    } catch (e) {
      /* ignore */
    }
    document.body.removeChild(ta);
  }
  document.querySelectorAll(".copy-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".tplcard");
      if (!card) return;
      const pre = card.querySelector("pre");
      if (!pre) return;
      const text = pre.textContent;
      const done = () => {
        btn.classList.add("ok");
        btn.textContent = "已复制 ✓";
        setTimeout(() => {
          btn.classList.remove("ok");
          btn.textContent = "复制模板";
        }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(() => copyFallback(text, done));
      } else {
        copyFallback(text, done);
      }
    });
  });
})();
