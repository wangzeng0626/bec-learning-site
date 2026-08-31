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
  document.querySelectorAll('a[href="#process-catalog"]').forEach((link) => {
    link.remove();
  });
  ["process-catalog", "faq-hub", "ipo-valuation", "logic-map", "week1", "week24", "month23"].forEach((id) => {
    document.getElementById(id)?.remove();
  });

  const readingOrder = [
    "home", "sop-flow",
    "culture", "essence", "mentor", "path",
    "client-analysis", "skill-deconstruct", "skill-industry",
    "sop-search", "exec-mapping", "sop-channel", "rel-refer",
    "resume", "skill-firstcall", "sop-call", "skill-candidate",
    "sop-recommend", "sop-interview", "sop-offer", "sop-onboard",
    "sop-payment", "sop-guarantee", "risk",
    "skill-embodied", "skill-llm", "skill-fde",
    "skill-bd", "client-dev",
    "faq-center", "deliverables", "tools",
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

  function organizeResearchLibrary(sectionId, description, modules) {
    const section = document.getElementById(sectionId);
    const library = section?.querySelector(".deep-reference");
    const body = library?.querySelector(":scope > .deep-reference-body");
    if (!body || body.dataset.organized === "true" || !modules?.length) return;
    library.querySelector(":scope > summary").textContent = "展开行业技术资料库：按当前问题选择模块";
    body.innerHTML =
      `<div class="research-library-guide"><b>这份资料库怎么用</b><span>${description}</span></div>` +
      modules
        .map(
          ({ title, content }, index) =>
            `<details class="research-module"><summary><span class="research-module-no">${String(index + 1).padStart(2, "0")}</span><span>${title}</span></summary>${content}</details>`
        )
        .join("");
    body.dataset.organized = "true";
  }

  organizeResearchLibrary(
    "skill-embodied",
    "主文负责判断公司现在处在哪一段；这里负责把问题拆到能接单、找人、深聊和交付。先打开与你手上岗位最相关的一项，不必从头读完。",
    [
      {
        title: "接单前：先把公司放进六格判断卡",
        content: "<p>具身单最怕从岗位名称开始。先拿到六项事实，才能判断客户缺的是研究、工程、交付还是量产的人。</p><table><thead><tr><th>必须确认的事实</th><th>要问到什么程度</th><th>答不清时怎么处理</th></tr></thead><tbody><tr><td><b>任务</b></td><td>机器人替谁完成哪一个动作或流程；客户为何付钱。</td><td>没有任务和验收标准，按探索型需求管理。</td></tr><tr><td><b>本体</b></td><td>人形、机械臂、移动操作还是已有设备；自由度、传感器和安全边界。</td><td>本体未定，别把跨本体能力当成已验证能力。</td></tr><tr><td><b>自主程度</b></td><td>哪些步骤自主，哪些依赖遥操、脚本或人工恢复。</td><td>先把 Demo 和真实自主运行分开写。</td></tr><tr><td><b>数据闭环</b></td><td>失败如何记录、标注、训练和再次部署。</td><td>没有失败回流，模型岗应先验证数据岗位和基础设施。</td></tr><tr><td><b>交付</b></td><td>客户现场接了哪些系统；第二个客户能复用什么。</td><td>每次从零开始，优先补部署、产品化和行业方案。</td></tr><tr><td><b>单位经济</b></td><td>部署人天、硬件成本、维护频率与客户回本逻辑。</td><td>无法说清，别把量产类岗位当刚需扩编。</td></tr></tbody></table><div class='callout tip'><span class='tt'>接单时可以直接说</span>“为了把人才地图画准，我想先确认六个点：具体任务、本体、自主程度、失败数据、现场复用和客户回本。您现在最卡的是哪一个？”</div>"
      },
      {
        title: "按岗位找人：具身技术职位地图",
        content: "<p>下面按猎头最常收到的职位名拆解。先看这张表定位人才池，再回到上一项确认公司真正卡在哪；<b>职位名称相同，工作内容可能完全不同。</b></p><table><thead><tr><th>职位</th><th>真正解决的问题</th><th>真经验要有的证据</th><th>优先来源</th><th>最常推错的人</th></tr></thead><tbody><tr><td><b>VLA / 机器人学习</b></td><td>把视觉、语言、状态信息变成可执行动作，并提高新任务泛化。</td><td>真机动作空间、数据规模、任务成功率、换任务后适配成本。</td><td>机器人学习实验室、具身团队、多模态 / RL 团队。</td><td>只做图文多模态或离线 benchmark 的人。</td></tr><tr><td><b>世界模型</b></td><td>预测环境和动作后果，用于规划、数据扩增或策略学习。</td><td>模型怎样服务控制或决策；仿真 / 真机误差、闭环收益和失败边界。</td><td>视频生成、强化学习、预测表征、具身研究团队。</td><td>只做视频生成、没有动作和控制接口的人。</td></tr><tr><td><b>运动控制 / 力控</b></td><td>让机械臂、人形或移动底盘在实时约束下稳定、安全地动作。</td><td>控制频率、接触任务、轨迹误差、碰撞 / 急停与恢复机制。</td><td>机器人本体、自动化、无人机、汽车控制团队。</td><td>只做高层规划、不懂真实执行与安全的人。</td></tr><tr><td><b>导航 / SLAM</b></td><td>定位、建图、路径规划和动态环境避障。</td><td>复杂环境定位精度、回环、弱纹理 / 动态障碍、线上恢复策略。</td><td>移动机器人、自动驾驶、无人机、AR / 视觉定位团队。</td><td>只做静态地图算法、没有真实机器人部署的人。</td></tr><tr><td><b>3D 视觉 / 感知</b></td><td>识别物体、位姿、抓取点和接触前后的环境状态。</td><td>遮挡、反光、长尾物料的处理；感知误差如何影响动作成功率。</td><td>工业视觉、自动驾驶感知、3D 重建、机器人视觉团队。</td><td>只做分类 / 检测、没接过控制闭环的人。</td></tr><tr><td><b>仿真 / Sim2Real</b></td><td>低成本造数据、验证策略，并缩小仿真与真机差距。</td><td>哪些参数随机化；差距如何量化；上线后节省多少真机采集和调试。</td><td>游戏引擎、机器人仿真、强化学习、数字孪生团队。</td><td>只会搭仿真场景、没对真实部署负责的人。</td></tr><tr><td><b>机器人系统 / 端侧部署</b></td><td>把模型、传感器、算力、控制器和现场系统真正接起来。</td><td>端到端延迟、算力限制、断网 / 断电恢复、版本回滚和远程日志。</td><td>嵌入式、边缘 AI、ROS、机器人系统、自动化集成团队。</td><td>只做云端模型服务、不懂硬件约束的人。</td></tr></tbody></table><div class='callout tip'><span class='tt'>职位澄清问题</span>客户说“招 VLA”时，先问：“这人要负责策略本身、数据、仿真、低层控制还是端侧部署？他做完后看成功率、部署速度还是成本？”答案会直接改变你的人才池。</div>"
      },
      {
        title: "技术地图：把“具身大脑”拆成六个可招聘的闭环",
        content: "<p>技术不是一个大词。候选人能创造什么价值，取决于他负责的是哪一段闭环，以及这段能力是否真的跑在真机上。</p><table><thead><tr><th>技术闭环</th><th>本质解决的问题</th><th>判断真经验的证据</th><th>常见人才来源</th></tr></thead><tbody><tr><td><b>感知与状态估计</b></td><td>看清物体、位姿、接触和环境变化。</td><td>说得出遮挡、反光、误检如何处理及线上指标。</td><td>3D 视觉、自动驾驶感知、工业视觉。</td></tr><tr><td><b>任务规划 / VLA</b></td><td>把语言和场景理解变成动作目标。</td><td>说明新任务如何定义、如何评测、何时需要重训。</td><td>多模态、机器人学习、具身 Agent。</td></tr><tr><td><b>低层控制与安全</b></td><td>让动作及时、稳定、可恢复。</td><td>讲清控制频率、接触失败、急停与降级机制。</td><td>运动控制、力控、嵌入式、自动化。</td></tr><tr><td><b>数据与仿真</b></td><td>低成本获得足够的动作与失败样本。</td><td>说得出采集、标注、仿真到真机的误差和回流路径。</td><td>遥操、仿真平台、数据引擎、RL。</td></tr><tr><td><b>系统与边缘部署</b></td><td>把模型接入传感器、算力、设备和现场系统。</td><td>说明延迟、断网、版本回滚、日志和远程诊断。</td><td>机器人系统、边缘 AI、嵌入式、集成工程。</td></tr><tr><td><b>制造与运维</b></td><td>让设备可造、可修、可规模化交付。</td><td>有 BOM、DFM、良率、MTBF、备件或售后结果。</td><td>消费电子、汽车、自动化设备、机器人本体。</td></tr></tbody></table><div class='callout warn'><span class='tt'>不要混淆</span>做过视觉模型不等于做过机器人闭环；做过控制不等于做过学习策略；做过遥操采集不等于做过数据飞轮。推荐前必须标注他在哪一环交付过什么。</div>"
      },
      {
        title: "岗位怎么拆：先找当前瓶颈，不按职位名称找人",
        content: "<table><thead><tr><th>客户说的痛点</th><th>真正的第一瓶颈</th><th>优先岗位</th><th>电话里验证候选人</th></tr></thead><tbody><tr><td>“模型泛化不够”</td><td>真机数据少，还是换场景后缺少动作与评测？</td><td>VLA、机器人学习、数据 / 仿真、Eval。</td><td>“换一个物料或任务，补多少数据？你们怎么知道效果真的变好了？”</td></tr><tr><td>“客户现场总翻车”</td><td>感知、控制、系统接入还是异常恢复？</td><td>机器人系统、视觉力控、测试可靠性、部署工程。</td><td>“最常见的三类失败是什么？从发现到恢复是谁负责？”</td></tr><tr><td>“项目做得太重”</td><td>方案没有标准化，还是产品接口不足？</td><td>行业方案、产品化、FDE / 应用工程、交付 PM。</td><td>“第二个客户删掉了哪些定制？上线周期缩短了多少？”</td></tr><tr><td>“准备规模交付”</td><td>成本、制造、质量还是售后体系未补齐？</td><td>DFM、质量、供应链、测试、售后负责人。</td><td>“你负责的指标是良率、BOM、MTBF 还是维修时长？前后数据如何？”</td></tr></tbody></table><div class='callout'><span class='tt'>岗位画像的最低标准</span>每张 JD 至少写清：<b>一个具体任务、一个当前瓶颈、一项成功指标、一个不适合的人群</b>。没有这四项，人才地图必然发散。</div>"
      },
      {
        title: "候选人深聊：研究型、系统型、交付型要分开问",
        content: "<table><thead><tr><th>候选人类型</th><th>先听什么</th><th>追问到什么程度</th><th>适配什么公司</th></tr></thead><tbody><tr><td><b>研究 / 算法型</b></td><td>问题定义、数据、评测和失败案例。</td><td>“论文或模型上线后，哪个指标变好？失败样本怎么反过来影响训练？”</td><td>路线未收敛、数据与策略仍是核心瓶颈的 0→1 公司。</td></tr><tr><td><b>系统 / 控制型</b></td><td>传感器、控制、延迟、安全和整机联调。</td><td>“遇到抖动、碰撞、断网或传感器异常时，系统怎样降级？”</td><td>真机复杂度上升、现场稳定性不足的公司。</td></tr><tr><td><b>数据 / 仿真型</b></td><td>采集效率、数据质量、仿真有效性与回流。</td><td>“哪些数据最值钱？仿真与真机差异如何被量化和修正？”</td><td>要建立训练飞轮、扩大任务覆盖的公司。</td></tr><tr><td><b>部署 / 交付型</b></td><td>客户流程、异常处理、上线节奏和复用。</td><td>“第一现场和第二现场分别花了多少人天？哪些经验沉进产品？”</td><td>PoC 转复制、交付成本过高的公司。</td></tr><tr><td><b>量产 / 运营型</b></td><td>制造、质量、售后和成本。</td><td>“你负责的量产指标是什么？一次质量事故如何闭环？”</td><td>已有订单、需要稳定出货和服务的公司。</td></tr></tbody></table><div class='callout tip'><span class='tt'>真正有价值的表达</span>“我不需要你把技术讲得多炫，想听你负责的那一段出了问题后，怎么判断、怎么修、最后留下了什么可复用的东西。”</div>"
      },
      {
        title: "交付与风险：Demo 为什么会在客户现场失效",
        content: "<p>具身商业化的难点，几乎都发生在实验室之外。以下四类问题同时也是判断客户是否真缺人的依据。</p><table><thead><tr><th>现场问题</th><th>表面现象</th><th>必须具备的组织能力</th><th>红旗</th></tr></thead><tbody><tr><td><b>环境漂移</b></td><td>光线、物料、治具或节拍一变就失败。</td><td>线上监控、数据采集、快速回归测试和版本管理。</td><td>只靠驻场工程师临时调参。</td></tr><tr><td><b>异常恢复</b></td><td>一次抓取失败、误识别或卡住就停机。</td><td>失败分类、降级策略、人工接管与恢复 SOP。</td><td>只汇报成功率，不记录失败类型。</td></tr><tr><td><b>客户系统接入</b></td><td>机器人能干活，但接不上 PLC、MES、WMS 或安全规范。</td><td>系统集成、现场工程、行业方案和客户项目管理。</td><td>销售承诺先行，技术边界未确认。</td></tr><tr><td><b>交付经济性</b></td><td>一个项目多人驻场数月，设备维护又贵。</td><td>产品化接口、远程运维、备件与服务模型。</td><td>把高人天项目说成软件订阅生意。</td></tr></tbody></table><div class='callout warn'><span class='tt'>止损规则</span>客户既没有付费任务、也没有验收口径、还要求找大量稀缺算法人才时，只做小范围市场验证，不进入重投入寻访。</div>"
      },
      {
        title: "美国对标怎么用：不抄名单，只看闭环和人才迁移",
        content: "<table><thead><tr><th>路线</th><th>代表样本</th><th>闭环重点</th><th>中国公司可对标的岗位</th></tr></thead><tbody><tr><td><b>自有本体 + VLA</b></td><td>Figure</td><td>本体、动作控制、任务数据与客户现场一起迭代。</td><td>真机 VLA、手部 / 传感器数据、控制、可靠性、制造。</td></tr><tr><td><b>跨本体策略</b></td><td>Physical Intelligence</td><td>多种机器人动作数据能否降低新任务与新本体的适配成本。</td><td>机器人学习、模仿学习、仿真到真机、真实世界 Eval。</td></tr><tr><td><b>硬件无关平台</b></td><td>Skild AI</td><td>仿真、视频与目标真机数据能否迁移成部署速度。</td><td>迁移学习、控制、系统平台、机器人集成。</td></tr><tr><td><b>推理层 + 动作层</b></td><td>Google DeepMind</td><td>空间推理、规划、动作和安全怎样被模块化部署。</td><td>具身 Agent、空间推理、VLA、边缘推理、安全评测。</td></tr><tr><td><b>家庭数据运营</b></td><td>1X</td><td>非结构化环境中的成功、失败与人工协作能否持续回流。</td><td>世界模型、遥操、数据运营、安全与用户现场运营。</td></tr></tbody></table><div class='callout'><span class='tt'>迁移判断</span>候选人来自美国路线不等于适合中国公司。先看他的经验能否迁移到<b>同样的本体、同样的任务难度、同样的现场约束和同样的组织阶段</b>。</div>"
      }
    ]
  );

  function rebuildSection(sectionId, html) {
    const section = document.getElementById(sectionId);
    const heading = section?.querySelector(":scope > h2");
    if (!section || !heading) return;
    Array.from(section.children).forEach((node) => {
      if (node !== heading) node.remove();
    });
    heading.insertAdjacentHTML("afterend", html);
  }

  function rebuildSectionKeepDeep(sectionId, html) {
    const section = document.getElementById(sectionId);
    const deepBlocks = section ? Array.from(section.querySelectorAll(":scope > .deep")) : [];
    rebuildSection(sectionId, html);
    deepBlocks.forEach((block) => section?.appendChild(block));
  }

  function appendPractice(sectionId, html) {
    const section = document.getElementById(sectionId);
    if (!section || section.querySelector(`:scope > [data-practice="${sectionId}"]`)) return;
    const block = document.createElement("div");
    block.className = "sop-practice";
    block.innerHTML = html;
    const practiceHeading = block.querySelector("h3");
    if (!practiceHeading) return;
    practiceHeading.remove();
    practiceHeading.dataset.practice = sectionId;
    section.appendChild(practiceHeading);
    section.appendChild(block);
  }

  function extendPractice(sectionId, html) {
    const section = document.getElementById(sectionId);
    const practice = section?.querySelector(":scope > .sop-practice");
    if (!practice || practice.querySelector(`[data-practice-extension="${sectionId}"]`)) return;
    const extension = document.createElement("div");
    extension.dataset.practiceExtension = sectionId;
    extension.innerHTML = html;
    practice.appendChild(extension);
  }

  function mergeLegacyDeepIntoPractice(sectionId) {
    const section = document.getElementById(sectionId);
    const practice = section?.querySelector(":scope > .sop-practice");
    if (!practice || practice.querySelector("[data-practice-method]")) return;
    const method = document.createElement("div");
    method.className = "practice-method";
    method.dataset.practiceMethod = "true";
    method.innerHTML = "<b>怎么用这份实战卡</b><span>先看你遇到的场景，再按“先判断 → 怎么说 → 当场动作 → 何时升级”执行。不要整段背话术，先拿到事实，再决定是否推进。</span>";
    practice.insertBefore(method, practice.firstChild);

    Array.from(section.querySelectorAll(":scope > .deep")).forEach((deep) => {
      const heading = deep.querySelector(":scope > h3");
      const title = (heading?.textContent || "补充剧本")
        .replace(/[🎯🗣️]/g, "")
        .replace(/^\s*实战深化\s*[·:：]?\s*/, "")
        .trim();
      heading?.remove();
      const legacy = document.createElement("div");
      legacy.className = "practice-legacy";
      legacy.innerHTML = `<h4>补充剧本：${title}</h4>`;
      while (deep.firstChild) legacy.appendChild(deep.firstChild);
      practice.appendChild(legacy);
      deep.remove();
    });
  }

  function appendSystemGuide(sectionId, html) {
    const section = document.getElementById(sectionId);
    const practice = section?.querySelector(":scope > .sop-practice:last-child");
    if (!practice || practice.querySelector("[data-system-guide]")) return;
    const norms = {
      "client-analysis": "<b>系统规范</b>：在「职位管理 / 职位对话」建立唯一项目；<b>项目负责人</b>在 Kickoff 当天更新项目结论、待确认事项和下次校准日期。",
      "skill-deconstruct": "<b>系统规范</b>：在「职位详情 / 自定义寻访条件」确认唯一的岗位搜索版本；<b>项目负责人</b>确认前，不开启批量寻访。",
      "skill-industry": "<b>系统规范</b>：在职位对话发起「自有人才库寻访」或 AI 寻访，并用「Mapping 编辑」补来源；<b>负责顾问</b>在首批样本后更新继续、调整或暂停的结论。",
      "sop-search": "<b>系统规范</b>：按「自有人才库 → 系统推荐 → 外部导入 → Mapping」的顺序找人；<b>寻访顾问</b>在每次触达后更新候选人流程状态和下一步。",
      "sop-call": "<b>系统规范</b>：电话结论回到候选人的职位流程卡；<b>负责顾问</b>在当天选择唯一下一步：深聊、推荐、暂缓、长期维护或停止。",
      "skill-candidate": "<b>系统规范</b>：长期事实沉淀在「人才管理」，本次匹配结论留在职位流程；<b>负责顾问</b>未核实能力、意愿、入职性或风险前，不得推进推荐。",
      "sop-recommend": "<b>系统规范</b>：先企业库查重，再发起「推荐人选 / 推荐报告」；<b>负责顾问</b>推荐当天记录客户反馈时限，<b>项目负责人</b>按需审核。",
      "sop-interview": "<b>系统规范</b>：从候选人流程发起「AI 约面 / 面试链接」；<b>负责顾问</b>在面试后 24 小时内回写双方结论和下一节点。",
      "sop-offer": "<b>系统规范</b>：在候选人流程添加 Offer，记录最终条件、预计入职日和风险；<b>项目负责人</b>确认后，顾问继续双线跟进至入职。",
      "sop-onboard": "<b>系统规范</b>：按系统入职提醒更新候选人流程；<b>负责顾问</b>在第 1 周和第 30 天记录双边跟进结论，异常由项目负责人升级处理。",
      "sop-payment": "<b>系统规范</b>：入职确认后在「合同管理 → 发票管理 → 回款管理」串联推进；<b>项目负责人</b>补齐业务材料，<b>财务 / 负责人</b>确认到账。",
      "sop-guarantee": "<b>系统规范</b>：按保证期提醒完成候选人与客户双边跟进；<b>负责顾问</b>记录触点和风险，保证结束后回流「人才管理」长期维护。"
    };
    const guide = document.createElement("div");
    guide.dataset.systemGuide = sectionId;
    guide.className = "callout tip system-guide";
    guide.innerHTML = norms[sectionId] || html;
    practice.appendChild(guide);
  }

  rebuildSection(
    "sop-flow",
    `<p class='subtitle'>这不是第二套话术。它先说明猎头工作的底层逻辑：你不是在完成“找简历”的动作，而是在替双方减少做错决定的概率。确认自己卡在哪个判断后，再进入后面的单一章节执行。</p>
    <h3>客户付费的，是更好的决策，不是更多的简历</h3>
    <div class='table-wrap'><table class='tight'><thead><tr><th>客户真正想避免什么</th><th>猎头要提供的价值</th><th>专业交付长什么样</th></tr></thead><tbody><tr><td><b>招错人</b>：入职后做不成，团队和业务一起付代价。</td><td>把“看起来不错”拆成岗位任务、经历证据、动机和风险。</td><td>客户能说清为什么约这个人、为什么不约另一个人。</td></tr><tr><td><b>招得慢</b>：业务等人、好人被别家拿走。</td><td>提前判断难点、集中验证关键假设、盯住每个决策节点。</td><td>每一步都有负责人、下一步和日期，不让项目在“再看看”里停住。</td></tr><tr><td><b>招得不稳</b>：Offer 接了又反悔，或入职后很快失配。</td><td>把候选人的真实顾虑、反要约、家庭、竞业和岗位预期提早摆上台面。</td><td>双方知道要付出什么、得到什么，以及还有什么风险没被解决。</td></tr></tbody></table></div>
    <div class='callout'><span class='tt'>本质</span>猎头的价值不在“认识很多人”，而在<b>信息不完整、时间有限、双方都有顾虑时，把一个模糊选择变成可比较、可解释、可推进的决定。</b></div>
    <h3>猎头实际在解决四种不确定</h3>
    <div class='sop-principles'><div><span>01</span><b>需求不确定</b><p>JD 写的是偏好，业务真正需要的是一个人在特定资源和约束下解决问题。</p><em>先问：他入职六个月后，什么结果算做成？</em></div><div><span>02</span><b>人选不透明</b><p>简历、面试表现和真实能力不是一回事；候选人对机会的兴趣也会变。</p><em>先找：他亲自负责过什么，结果如何，换到这里还能不能复现？</em></div><div><span>03</span><b>决策不协同</b><p>用人经理、HR、老板和候选人掌握的信息不同，常常在不同时间才表态。</p><em>先管：谁拍板、谁会否决、缺什么事实、何时必须决定？</em></div><div><span>04</span><b>承诺不稳定</b><p>接受 Offer 不等于入职，入职不等于留下；外部机会和内部变化会持续发生。</p><em>先盯：哪些条件还没兑现，什么信号出现就要提前处理？</em></div></div>
    <div class='callout tip'><span class='tt'>专业边界</span>不是把每个人都说服过来。真正专业的顾问，能在不合适时对客户说“这个条件市场上不成立”，也能对候选人说“这个机会不一定适合你”。</div>
    <h3>一张单只过六道关</h3>
    <div class='gate-row'><div class='gate'><span>01</span><b>确认值得做</b><em>HC、预算、拍板人和节奏真实吗？</em></div><div class='gate'><span>02</span><b>定义成功</b><em>这个人进来后究竟要把什么事做成？</em></div><div class='gate'><span>03</span><b>校准市场</b><em>市场有没人、愿不愿动、条件够不够？</em></div><div class='gate'><span>04</span><b>评估人选</b><em>能做、想来、能入职、风险可控吗？</em></div><div class='gate'><span>05</span><b>促成决定</b><em>双方还缺什么信息，谁该在何时拍板？</em></div><div class='gate'><span>06</span><b>保护结果</b><em>入职、回款、保证期有哪些失控点？</em></div></div>
    <h3>每一道关，交的是能推动下一个决定的证据</h3>
    <div class='table-wrap'><table><thead><tr><th>阶段</th><th>必须回答的问题</th><th>结论至少要有的事实</th><th>不过关时做什么</th></tr></thead><tbody><tr><td><b>接单</b></td><td>这单值不值得投入？</td><td>HC、预算、业务动因、拍板人、反馈承诺。</td><td>只做小范围验证，不重投入。</td></tr><tr><td><b>岗位定义</b></td><td>什么样的人能做成？</td><td>成功结果、必须项、可放宽项、绝对不合适项。</td><td>回到用人经理，把取舍写清。</td></tr><tr><td><b>市场验证</b></td><td>原条件在市场上成立吗？</td><td>首批样本、来源、薪酬、意愿与拒绝原因。</td><td>调条件、调薪、换来源或暂停。</td></tr><tr><td><b>候选人判断</b></td><td>为什么是他？</td><td>任务证据、动机、入职条件、风险和待核实项。</td><td>补事实，不靠感觉推荐。</td></tr><tr><td><b>推进决定</b></td><td>为什么现在能做决定？</td><td>双方顾虑、解决方案、责任人、下次决定时间。</td><td>只解决当前卡点，不盲目加轮次。</td></tr><tr><td><b>保护结果</b></td><td>什么会让结果倒退？</td><td>离职进度、岗位兑现、入职适应、合同与回款状态。</td><td>先修复风险，再判断责任和升级路径。</td></tr></tbody></table></div>
    <h3>国际专业团队怎样把流程做稳</h3>
    <p>成熟的国际猎头团队并不是“流程更多”，而是把以下六件事一次做好，并分别放在对应阶段，不来回重复。</p>
    <div class='table-wrap'><table><thead><tr><th>统一执业标准</th><th>在本手册落在哪一关</th><th>顾问必须守住什么</th></tr></thead><tbody><tr><td><b>先签清项目边界</b><br>范围、角色、费用、保密、利益冲突、反馈和保证期在启动时说清。</td><td>客户分析</td><td>没有授权、负责人和反馈机制，只做市场验证；不让候选人简历在多个客户间“漂”。</td></tr><tr><td><b>先做 Success Profile（成功画像）</b><br>从业务任务、组织环境和成功结果，倒推出能力、经历、领导方式和关键取舍。</td><td>岗位解构</td><td>不把 JD 当画像；不只看行业和公司名；任何“必须有”都要有验证方式。</td></tr><tr><td><b>先用样本校准，再放大寻访</b><br>先画目标公司与首批名单，和客户共同确认市场、薪酬和来源假设。</td><td>市场验证、寻访</td><td>不闷头找一周再汇报；样本推翻假设时，先改岗位条件，不粉饰名单。</td></tr><tr><td><b>用多重证据判断人</b><br>既看已做成的事，也看能力、适应空间、动机、文化和风险。</td><td>候选人判断、推荐</td><td>一通电话和一份简历都不够；结论要把事实、优势、短板、待核实项分开写。</td></tr><tr><td><b>把候选人当合作对象</b><br>授权后再推荐；过程透明；结束时给明确反馈，持续保护敏感信息。</td><td>电话、面试、风控</td><td>不诱导、不夸大、不泄露；客户暂停或拒绝，也要及时告诉候选人并说明下一步。</td></tr><tr><td><b>把入职当成搜索的最后一段</b><br>背调、Offer、反要约、团队融入和早期目标是一个连续风险链。</td><td>Offer、入职、保证期</td><td>不把签字当成交；要核对岗位承诺是否兑现、关键关系是否接上、风险是否有修复人。</td></tr></tbody></table></div>
    <div class='callout tip'><span class='tt'>一条工作纪律</span>卡住时，不是更用力找人。先判断缺的是<b>岗位事实、市场证据、人选信息，还是双方决定</b>；只回到缺失的那一关补齐，不把所有动作重做一遍。</div>
    <div class='table-wrap'><table><thead><tr><th>SOP 原则</th><th>系统怎样承接</th></tr></thead><tbody><tr><td>一张单只有一个真相源</td><td>每个职位只在一个职位项目和职位对话中推进，禁止个人表格另起流程。</td></tr><tr><td>结论必须可追溯</td><td>每次沟通至少留四件事：新事实、你的结论、唯一下一步、负责人和日期。</td></tr><tr><td>风险必须看得见</td><td>待核实、暂停、拒绝、Offer、入职异常和回款卡点都更新状态，不靠口头同步。</td></tr></tbody></table></div>`
  );

  rebuildSection(
    "client-analysis",
    "<p class='subtitle'>客户分析只回答四件事：这家公司是否真要招、这张单是否值得投、谁能推动决定、流程会不会拖。岗位到底要谁，放到下一章解决。</p><h3>先判断：这是不是一张能做的单</h3><div class='table-wrap'><table><thead><tr><th>必须确认</th><th>可投入</th><th>先验证</th><th>先暂停</th></tr></thead><tbody><tr><td>HC 与预算</td><td>已批、区间明确</td><td>口头确认，待批</td><td>无 HC 或不谈预算</td></tr><tr><td>招聘动因</td><td>业务任务和时点明确</td><td>方向明确，任务待定</td><td>只给一份泛 JD</td></tr><tr><td>决策链</td><td>用人经理、拍板人、轮次明确</td><td>目前只对接 HR</td><td>谁决定都说不清</td></tr><tr><td>合作节奏</td><td>反馈 SLA、费用和回款明确</td><td>有一项待补</td><td>历史失联或条款回避</td></tr></tbody></table></div><div class='callout warn'><span class='tt'>投入规则</span>信息不全不等于拒绝客户；但只能做小范围市场验证，不能承诺交付时间或重投入寻访。</div><h3>启动会（Kickoff，项目启动会）要拿到什么</h3><p>Kickoff 不是“介绍一下公司”。它是一场把招聘项目开起来的对齐会。<b>Kickoff = 项目启动会；Search Brief = 寻访说明；Hiring Manager = 用人经理；SLA = 双方约定的反馈时限。</b></p><div class='table-wrap'><table><thead><tr><th>用人话问</th><th>你实际在确认什么</th></tr></thead><tbody><tr><td>“为什么一定是现在补这个人？”</td><td>业务紧急度与 HC 真实性。</td></tr><tr><td>“他进来三个月、六个月各要做成什么？”</td><td>成功标准；下一章再把它写成岗位画像。</td></tr><tr><td>“遇到特别合适但超预算的人，最后谁拍板？”</td><td>真实决策人和特批路径。</td></tr><tr><td>“每轮面试各想确认什么？谁会参加？”</td><td>流程与潜在否决人。</td></tr><tr><td>“推荐后多久能给明确结论？”</td><td>候选人预期和项目节奏。</td></tr></tbody></table></div><h3>谁在推进，谁能拍板</h3><div class='keypoints'><div class='kp'><b>业务负责人</b>决定人选是否真能解决问题；优先对齐任务和取舍。</div><div class='kp'><b>HR / 招聘</b>负责流程、职级、薪酬和协调；不要把他误认为唯一拍板人。</div><div class='kp'><b>老板 / 预算人</b>决定超带宽、组织优先级和最终例外；必须知道他在哪一轮出现。</div><div class='kp'><b>潜在否决人</b>可能是技术负责人、合伙人或业务协作方；尽早问清他最担心什么。</div></div><h3>这单什么时候该停</h3><div class='callout danger'><span class='tt'>四个暂停信号</span>预算冻结、用人经理更换、业务方向重置、连续两次不按约反馈。暂停时留下书面纪要：已确认事实、待客户决定事项、恢复条件和下次确认日期。</div>"
  );

  rebuildSection(
    "skill-deconstruct",
    "<p class='subtitle'>岗位定义只做一件事：把“JD 上的要求”翻成“谁能在这个组织里把事做成”。公司阶段、预算和决策链不在这里重复。</p><h3>先写一句岗位成功定义</h3><div class='callout'><span class='tt'>写法</span>“这个人向谁负责，在什么资源与约束下，解决什么问题；入职 90 天和 6 个月分别交付什么结果。”<br><b>写不出这句话，不开始找人。</b></div><h3>岗位画像只保留四部分</h3><div class='table-wrap'><table><thead><tr><th>部分</th><th>写什么</th><th>不要写什么</th></tr></thead><tbody><tr><td><b>必须有</b></td><td>没有就无法完成任务的经历、能力或管理范围。</td><td>把所有理想条件都塞进去。</td></tr><tr><td><b>可迁移</b></td><td>相邻行业、相邻场景、可以在入职后补齐的能力。</td><td>把“没做过本行业”直接判死刑。</td></tr><tr><td><b>绝对不要</b></td><td>会造成明显失配的管理方式、动机、经历或约束。</td><td>模糊写“稳定性不好”。</td></tr><tr><td><b>验证方式</b></td><td>面试和电话里怎样证明他真做过。</td><td>只写“沟通好、抗压强”。</td></tr></tbody></table></div><h3>和用人经理把取舍说透</h3><div class='keypoints'><div class='kp'><b>背景不够</b>：哪一项可以放宽，换什么可验证结果？</div><div class='kp'><b>薪酬不够</b>：哪些候选人无需接触，什么条件可特批？</div><div class='kp'><b>时间太急</b>：是先要能上手的人，还是愿意培养的人？</div><div class='kp'><b>上一任失败</b>：失败的是能力、资源、老板预期，还是岗位本身？</div></div><h3>把画像交给寻访之前，做一次翻译</h3><p><b>岗位评分卡</b>负责定义“什么叫合适”；<b>Search Brief（寻访说明）</b>负责把它翻成目标公司、相邻来源、职级、薪酬、地点与电话验证问题。前者给客户确认，后者给寻访执行。两张纸不能混写。</p>"
  );

  rebuildSection(
    "skill-industry",
    "<p class='subtitle'>市场验证不是做行业报告。它只回答：按当前条件，市场上有没有这种人；如果没有，客户要放宽什么、加什么，还是暂停。</p><h3>先用首批样本验证，不用想象验证</h3><div class='table-wrap'><table><thead><tr><th>首批 10 人要看什么</th><th>得到什么结论</th><th>下一步</th></tr></thead><tbody><tr><td>是否存在同类经历</td><td>人才池够不够</td><td>扩大目标公司，或接受相邻背景。</td></tr><tr><td>薪酬与职级是否匹配</td><td>预算能否买到</td><td>调薪、调级，或把岗位拆开。</td></tr><tr><td>哪些人愿意谈</td><td>卖点是否成立</td><td>改客户故事、岗位范围或触达方式。</td></tr><tr><td>客户真正认可什么</td><td>画像是否写对</td><td>带着样本回去校准评分卡。</td></tr></tbody></table></div><h3>市场验证的四种结论</h3><div class='keypoints'><div class='kp'><b>能找到</b>：扩大寻访，按优先级推进。</div><div class='kp'><b>能找到但买不起</b>：先谈预算、职级或激励，不硬推低配人选。</div><div class='kp'><b>能找到但不愿动</b>：先修正机会卖点和流程速度。</div><div class='kp'><b>市场上本来就没有</b>：重写必须项，接受迁移来源，或建议客户分阶段招。</div></div><h3>什么时候才需要行业研究</h3><p>只有三种情况再打开行业章节：<b>不熟悉这个岗位的技术语言、需要判断相邻人才来源、需要向客户解释市场供给。</b>行业研究的结论必须回填到岗位评分卡；不能单独成为一篇“看起来很专业”的报告。</p><div class='callout tip'><span class='tt'>实际动作</span>先做 10 人市场验证；确认卡点后再看<a href='#skill-embodied'>具身智能</a>、<a href='#skill-llm'>大模型</a>或陌生赛道资料。这样行业分析才会服务寻访，而不是拖慢寻访。</div><h3>长期激励只在岗位需要时讨论</h3><p>期权、限制性股票和跟投不是本章重点。只有当候选人的接受条件确实依赖长期激励时，才回到 Offer 阶段按归属、行权、回购、税务和兑现条件逐项核实；不拿账面估值替代现金薪酬。</p>"
  );

  rebuildSection(
    "exec-mapping",
    "<p class='subtitle'>这套方法不只适合高管。只要岗位稀缺、被动候选人为主、错误代价高，就要用 Mapping（人才地图）：中高端技术、产品、销售和关键职能都适用。</p><h3>什么时候不用平台硬搜，要先画人才地图</h3><div class='table-wrap'><table><thead><tr><th>适用情况</th><th>为什么要 Mapping</th><th>最低交付</th></tr></thead><tbody><tr><td>总监、高管、关键负责人</td><td>人少、关系敏感、组织与时机比关键词更重要。</td><td>目标公司、组织结构、核心人、状态、切入点。</td></tr><tr><td>稀缺技术 / 产品骨干</td><td>职位名称不统一，靠关键词会漏人。</td><td>能力标签、项目经历、相邻来源、验证问题。</td></tr><tr><td>中高端销售 / 职能</td><td>客户资源、行业圈层和业绩口径需要交叉验证。</td><td>客户覆盖、汇报线、业绩事实、转职窗口。</td></tr></tbody></table></div><h3>人才地图不是名单，是一张决策图</h3><p>每个人都要有五个字段：<b>现在做什么、做过什么关键结果、为什么可能愿意听、谁能验证、下一步什么时候发生。</b>没有状态和下一步日期的名单，不叫 Mapping。</p><h3>四步做法</h3><div class='keypoints'><div class='kp'><b>画范围</b>：目标公司 + 相邻公司 + 回流来源；不要一上来画 100 家。</div><div class='kp'><b>落到人</b>：每家公司先找 2—3 个最相关的人，不按层级凑数。</div><div class='kp'><b>找窗口</b>：组织调整、汇报变化、业务完成、激励兑现、团队缩编都是信息线索。</div><div class='kp'><b>用真人修图</b>：每次深聊后更新组织、能力、意愿和转介绍关系。</div></div><h3>中高端候选人的开场别像推销</h3><div class='callout tip'><span class='tt'>更自然的说法</span>“我不是想立刻挖您。最近在看 XX 方向的人才分布，您做过这段关键项目，想请教两个判断；如果我手上的机会确实值得您花时间，我再完整讲。”<br>先给对方选择权，再证明你理解他的价值。</div>"
  );

  rebuildSection(
    "sop-channel",
    "<p class='subtitle'>渠道不是四个网站的使用说明。公司最重要的寻访资产是自己的可复用人才库；平台、社交和转介绍只是让人才库持续更新的入口。</p><h3>先把人才库当成公司资产</h3><div class='table-wrap'><table><thead><tr><th>每个联系人最少记录</th><th>为什么重要</th></tr></thead><tbody><tr><td><b>能力与项目</b>：做过什么、能解决什么问题</td><td>下次接到相似单，不需要重新猜。</td></tr><tr><td><b>意愿与约束</b>：当前状态、薪酬、地点、竞业、家庭与时间窗口</td><td>避免重复骚扰，也避免到 Offer 才发现不能动。</td></tr><tr><td><b>关系温度</b>：陌生、聊过、合作过、内线、可转介绍</td><td>决定触达方式和优先级。</td></tr><tr><td><b>来源与授权</b>：从哪里认识、何时更新、是否同意保留联系</td><td>保证数据合规、可追溯、可维护。</td></tr><tr><td><b>下一步日期</b></td><td>人才库不是通讯录；没有下一步就是沉睡数据。</td></tr></tbody></table></div><h3>公司人才库每周怎么维护</h3><div class='keypoints'><div class='kp'><b>入库</b>：每次有效电话后 24 小时内补齐事实，不只上传简历。</div><div class='kp'><b>分层</b>：A 是当前可推荐，B 是中期窗口，C 是长期关系；不按“喜欢程度”分。</div><div class='kp'><b>更新</b>：组织变化、离职、薪酬、意愿和新项目一旦得知就更新。</div><div class='kp'><b>复用</b>：新单先查内部库，再决定去外部平台扩量。</div></div><h3>外部渠道只解决不同问题</h3><div class='table-wrap'><table><thead><tr><th>渠道</th><th>适合用来做什么</th><th>不要拿它做什么</th></tr></thead><tbody><tr><td>内部人才库</td><td>最快验证画像、找已建立关系的人。</td><td>当成不更新的旧简历仓库。</td></tr><tr><td>招聘平台</td><td>补充活跃候选人、验证薪酬和关键词。</td><td>替代人才地图。</td></tr><tr><td>LinkedIn / 脉脉</td><td>看组织、项目、行业关系和被动候选人。</td><td>群发模板消息。</td></tr><tr><td>转介绍</td><td>进入低流动、高信任圈层。</td><td>没有价值交换就硬要名单。</td></tr></tbody></table></div><h3>渠道复盘只看三个数</h3><p>每周按岗位看：<b>有效触达率、有效沟通率、进入推荐率</b>。回复多但不合适，是名单和钩子问题；沟通多却不推荐，是画像或初筛问题；推荐多却没面试，是客户定义问题，不要把责任都推给渠道。</p>"
  );

  rebuildSection(
    "rel-refer",
    "<p class='subtitle'>人才关系不属于“电话后的附加动作”，而是寻访阶段就开始经营的长期资产。它放在人才库之后，是因为每一次关系都要回到可维护、可复用的记录里。</p><h3>关系经营的目标不是立刻成交</h3><div class='table-wrap'><table><thead><tr><th>关系阶段</th><th>你该提供什么</th><th>下一步</th></tr></thead><tbody><tr><td>初次认识</td><td>准确的行业信息、对其经历的理解、不过度打扰。</td><td>约定何时再聊，记录他真正关心的方向。</td></tr><tr><td>正在看机会</td><td>机会判断、流程信息、薪酬与风险提醒。</td><td>把意愿、约束和决策节奏写清。</td></tr><tr><td>暂时不动</td><td>行业变化、组织信息、对标机会，不强推职位。</td><td>设 60—90 天轻触点。</td></tr><tr><td>已合作 / 已入职</td><td>过渡期支持、行业资源、长期职业信息。</td><td>成为内线或在合适时获得转介绍。</td></tr></tbody></table></div><h3>什么时候开口要转介绍</h3><p>先确认对方觉得你提供过价值，再把门槛降到最低：<b>“你身边有没有做过 XX 的人？不方便给联系方式也没关系，给我一个名字或公司方向，我自己研究。”</b>不要在对方刚拒绝职位、刚入职或正被项目压住时硬要。</p><h3>关系记录只记事实</h3><div class='callout'><span class='tt'>每次沟通后</span>更新：他现在的任务、意愿变化、约束、行业观点、可验证关系和下次触点。不要写情绪化标签，例如“人不错”“不太好聊”。</div>"
  );

  rebuildSection(
    "risk",
    "<p class='subtitle'>风控不是最后做一次背调，而是在每个节点提前发现“继续推进会让谁受损”。这章只讲现场动作：谁发现、怎么核实、怎么留痕、什么时候停止。</p><h3>接单：先防无效投入和信息误导</h3><div class='table-wrap'><table><thead><tr><th>风险信号</th><th>当场怎么做</th><th>必须留下什么</th></tr></thead><tbody><tr><td>预算、HC、拍板人说不清</td><td>降为市场验证；不承诺周期，不大量触达候选人。</td><td>待确认事项、客户 Owner、确认日期。</td></tr><tr><td>替补岗但不说上一任为何离开</td><td>至少分清能力、组织、资源、老板预期哪一类问题。</td><td>岗位风险说明写进 Search Brief。</td></tr><tr><td>客户要求隐瞒公司、薪酬或工作地点</td><td>明确候选人沟通边界；涉及重大条件不隐瞒。</td><td>客户确认的对外口径。</td></tr></tbody></table></div><h3>推荐：先防履历、竞业和信息授权问题</h3><div class='table-wrap'><table><thead><tr><th>发现什么</th><th>先问谁</th><th>怎么处理</th></tr></thead><tbody><tr><td>简历、平台、口述时间线不一致</td><td>先私下问候选人，给他一次完整更正机会。</td><td>单点口径问题可更正；多处矛盾或核心造假停止推荐。</td></tr><tr><td>竞业、保密、客户资源敏感</td><td>候选人本人；必要时建议其咨询专业人士。</td><td>不索要、不转发前雇主机密；把入职时间与工作边界写清。</td></tr><tr><td>客户要候选人私人信息或背调联系人</td><td>先征得候选人明确同意。</td><td>没有授权不传递；记录授权范围和时间。</td></tr></tbody></table></div><h3>面试与 Offer：先防期望错配和临门反悔</h3><div class='keypoints'><div class='kp'><b>每轮面试后</b>：分别问双方“最担心什么、还缺什么事实、下一轮要验证什么”。</div><div class='kp'><b>Offer 前</b>：把现金、激励、汇报线、权限、地点、到岗时间、竞业和 Counter Offer 单独确认，不用“差不多”代替。</div><div class='kp'><b>发现新增风险</b>：立刻标记为红 / 黄 / 绿；红色必须停，黄色要有 Owner 和截止日，绿色才继续。</div></div><h3>入职到过保：风险发生时怎么处理</h3><div class='table-wrap'><table><thead><tr><th>场景</th><th>前 24 小时动作</th><th>后续动作</th></tr></thead><tbody><tr><td>候选人突然不去</td><td>先了解真实原因，不先指责；确认是否可修复。</td><td>如不可修复，向客户同步事实、替补方案和时间表。</td></tr><tr><td>入职后说工作不对</td><td>分别听候选人与直属上级，区分任务、资源、管理和预期问题。</td><td>约定 1—2 个可观察的修复动作和复查日期。</td></tr><tr><td>客户要求“立刻换人”</td><td>核实试用期事实与原岗位承诺是否一致。</td><td>按合同和保证期规则处理，不口头承诺超范围责任。</td></tr></tbody></table></div><div class='callout danger'><span class='tt'>必须停止的情况</span>学历 / 身份 / 核心履历造假；要求泄露前雇主机密；未经授权传递敏感信息；客户要求误导候选人；任何一方要求删改事实记录。停止推进、保留书面纪要、必要时上报负责人。</div><h3>给候选人的人话提醒</h3><div class='script'><div class='s-line you'><span class='who'>你</span><span class='txt'>“背景好不好可以一起判断，但信息必须准确。哪怕有一段经历不完美，也比背调时被发现不一致好。你现在一次说清，我才能判断这单还能不能稳妥推进。”</span></div></div>"
  );

  rebuildSection(
    "faq-center",
    "<p class='subtitle'>问题速查只负责导航：你遇到什么症状，就告诉你先去哪个章节。具体判断和处理放在风险、接单、寻访、沟通、Offer 等正文里，避免同一套答案写三遍。</p><h3>按症状找到第一站</h3><div class='table-wrap'><table><thead><tr><th>你现在卡在哪</th><th>先看哪里</th><th>要带着什么问题去</th></tr></thead><tbody><tr><td>客户不清楚要谁、不给反馈</td><td><a href='#client-analysis'>客户分析</a> / <a href='#skill-deconstruct'>岗位定义</a></td><td>单子真实吗？人到岗后要做什么？谁拍板？</td></tr><tr><td>市场上找不到、薪酬不匹配</td><td><a href='#skill-industry'>市场验证</a> / <a href='#sop-search'>寻访</a></td><td>是没人、买不起，还是不愿动？</td></tr><tr><td>候选人聊不深、总是没下文</td><td><a href='#sop-call'>电话沟通</a> / <a href='#skill-candidate'>候选人判断</a></td><td>他能做、想来、能入职、风险分别是什么？</td></tr><tr><td>面试拖、Offer 反复、入职反悔</td><td><a href='#sop-interview'>面试管理</a> / <a href='#sop-offer'>Offer</a> / <a href='#sop-onboard'>入职跟进</a></td><td>哪个人没做决定？还缺什么事实？</td></tr><tr><td>履历、竞业、授权、背调出现问题</td><td><a href='#risk'>全流程风险处理</a></td><td>先核实什么、谁能授权、什么情况必须停？</td></tr></tbody></table></div><div class='callout tip'><span class='tt'>使用方式</span>速查只帮你定位。不要在这里找“万能话术”；进入对应章节后，按事实、风险和下一步动作处理。</div>"
  );

  rebuildSection(
    "deliverables",
    "<p class='subtitle'>交付物中心只放“做单时要产出的判断文件”。模板的使用方法、系统与资料放到下一章，避免同一份表重复出现。</p><h3>一张单只需要八类交付物</h3><div class='table-wrap'><table><thead><tr><th>节点</th><th>交付物</th><th>它要解决的问题</th></tr></thead><tbody><tr><td>接单</td><td>客户信息卡</td><td>单子是否真实、谁拍板、风险在哪。</td></tr><tr><td>岗位定义</td><td>岗位评分卡 / Search Brief</td><td>什么叫合适、范围从哪里开始找。</td></tr><tr><td>市场验证</td><td>首批市场结论</td><td>条件是否要调、为什么调。</td></tr><tr><td>寻访</td><td>Longlist / 人才地图</td><td>先找谁、每个人是什么状态。</td></tr><tr><td>候选人判断</td><td>候选人评估卡</td><td>能做、想来、能入职、风险是否有事实。</td></tr><tr><td>推荐与面试</td><td>推荐报告 / 面试决策记录</td><td>客户为什么要见、每轮要验证什么。</td></tr><tr><td>Offer 与入职</td><td>接受条件与风险表</td><td>双方是否真正接受、哪里可能反悔。</td></tr><tr><td>回款与保证期</td><td>回款表 / 保证期触点记录</td><td>责任人、时间点、异常处理。</td></tr></tbody></table></div><div class='callout'><span class='tt'>标准</span>每份交付物都必须能让下一位接手的人在 3 分钟内知道：已确认的事实、未确认的风险、下一步由谁在何时完成。</div>"
  );

  rebuildSection(
    "tools",
    "<p class='subtitle'>工具与模板不再重复交付物。这里讲的是用什么系统、怎样保证信息可复用；具体要交什么文件，去上一章。</p><h3>团队最少需要四类工具</h3><div class='table-wrap'><table><thead><tr><th>工具类别</th><th>用途</th><th>管理原则</th></tr></thead><tbody><tr><td>ATS / 人才库</td><td>记录人、关系、状态、来源和下一步。</td><td>每次有效沟通后更新，不把它当简历硬盘。</td></tr><tr><td>项目看板</td><td>看职位进展、候选人漏斗、风险和客户待决事项。</td><td>只写变化、Owner 和日期，不写大段流水账。</td></tr><tr><td>研究与寻访工具</td><td>查公司、组织、项目、公开资料和候选人线索。</td><td>公开信息与个人敏感信息分开管理。</td></tr><tr><td>沟通与文档工具</td><td>保存客户确认、候选人授权和关键决策记录。</td><td>关键事实书面确认，版本可追溯。</td></tr></tbody></table></div><h3>模板怎么用才不变成形式主义</h3><div class='keypoints'><div class='kp'><b>先填事实</b>：不知道就留“待确认”，不要用猜测补齐。</div><div class='kp'><b>再写结论</b>：每张表只保留会改变下一步的结论。</div><div class='kp'><b>最后定 Owner</b>：客户、候选人、猎头、Leader 分别谁来完成。</div></div>"
  );

  rebuildSection(
    "path",
    "<p class='subtitle'>新人不需要背完手册才开始做单。60 天的目标，是在适合的岗位难度下，学会用同一套判断方法跑完一次真实闭环；是否独立，按能力短板分流，不按统一成绩单判定。</p><h3>先判断新人缺什么，再安排训练</h3><div class='table-wrap'><table><thead><tr><th>新人类型</th><th>常见短板</th><th>60 天重点</th></tr></thead><tbody><tr><td><b>研究搜寻强、开口弱</b></td><td>名单很长，电话不敢打或问不深。</td><td>跟听、角色扮演、首通电话复盘。</td></tr><tr><td><b>销售感强、方法弱</b></td><td>推进快，但事实、记录和风险缺失。</td><td>接单评分、岗位评分卡、推荐前核实。</td></tr><tr><td><b>有招聘经验、换了赛道</b></td><td>懂流程，不懂公司、岗位和人才迁移。</td><td>行业判断、人才地图、与用人经理校准。</td></tr></tbody></table></div><h3>第 1—10 天：会接单，也会建第一版名单</h3><p>旁听真实 Kickoff（项目启动会）和候选人电话；用一个低难度真实岗位完成客户信息卡、岗位评分卡和 20 人 Longlist（寻访长名单）。导师只检查：事实是否完整、范围是否合理、每个人是否有来源和下一步。</p><h3>第 11—30 天：在陪同下跑通一次</h3><p>独立完成首批触达、3—5 通深聊、一次市场校准和一份推荐报告。导师在推荐前和关键电话后 Review；训练重点不是凑 Offer，而是能解释“为什么这个人值得推、还缺什么证据”。</p><h3>第 31—60 天：承担一张小而完整的单</h3><p>选择职责清楚、反馈正常的中级岗位，独立推进到面试或 Offer 节点；同时维护人才库、写一次失败复盘。高管、极稀缺技术岗或决策链混乱的岗位，不作为新人独立考核样本。</p><h3>第 60 天怎么决定下一步</h3><div class='keypoints'><div class='kp'><b>可以独立</b>：能说清事实、判断、风险和下一步，并能按节奏向客户与候选人推进。</div><div class='kp'><b>带着短板独立</b>：只在电话、画像或 Offer 等一个环节继续由导师把关，其他环节独立。</div><div class='kp'><b>继续带教</b>：不是“没成单”，而是关键事实、职业诚信或复盘能力仍不稳定；明确补哪一项、再观察两周。</div></div><div class='callout'><span class='tt'>带教原则</span>每周只抓一个最影响成单的动作。先让新人把一张单讲清楚，再增加岗位数量；不把 Offer 数量当成唯一的出师标准。</div>"
  );

  rebuildSectionKeepDeep(
    "sop-call",
    `<p class='subtitle'>电话不是把岗位从头讲一遍，而是判断这个人值不值得继续投入时间。先拿到事实和真实顾虑；能力结论放到“候选人判断”，推荐结论放到“推荐”里。</p>
    <h3>电话到底要拿到什么</h3>
    <div class='table-wrap'><table><thead><tr><th>这通电话要确认</th><th>用人话怎么问</th><th>拿不到时怎么处理</th></tr></thead><tbody><tr><td><b>他现在在做什么</b></td><td>“你现在最花时间的一件事是什么？你自己负责到哪一段？”</td><td>只留为初步线索，不急着讲岗位。</td></tr><tr><td><b>他为什么愿意听</b></td><td>“如果半年内什么都不变，你会留下；什么变化会让你认真看看外面的机会？”</td><td>按长期关系维护，约合适的轻触点。</td></tr><tr><td><b>这单有没有击中他</b></td><td>只讲和他相关的任务、老板、发展和约束，再问：“这里面哪一点对你有意义，哪一点会让你犹豫？”</td><td>不硬推，记录不匹配原因。</td></tr><tr><td><b>能不能进入流程</b></td><td>“如果双方都觉得合适，时间、地点、薪酬、竞业或家庭上有什么要先摊开？”</td><td>标成待核实，别把“有兴趣”当作可推荐。</td></tr><tr><td><b>下一步是什么</b></td><td>“我们这一步先做哪件小事最合适：再深聊一个项目、我补充资料，还是先放一放？”</td><td>没有明确日期和动作，就不算有效推进。</td></tr></tbody></table></div>
    <h3>不同状态的人，电话目标不同</h3>
    <div class='table-wrap'><table><thead><tr><th>候选人状态</th><th>这通电话先解决什么</th><th>自然的收口</th></tr></thead><tbody><tr><td><b>主动在看</b></td><td>弄清真实排序：钱、工作内容、老板、成长、地点，别急着卖完岗位。</td><td>确认前三个条件、其他流程和可面试时间。</td></tr><tr><td><b>被动但愿意听</b></td><td>找到触发点：什么变化才值得离开，而不是把他当成近期人选。</td><td>约定一个具体的行业信息或下次联系时间。</td></tr><tr><td><b>被猎头骚扰过</b></td><td>先恢复信任：说明为什么找他、可不可以不聊、哪些信息可以先不透露。</td><td>让他自己决定要不要接收一页岗位信息。</td></tr><tr><td><b>刚入职或明显不方便</b></td><td>尊重当前阶段，不抢着约面试。</td><td>“我先不推，过两三个月我再问一次近况，可以吗？”</td></tr><tr><td><b>中高端 / 时间很碎</b></td><td>用最少时间确认价值：当前任务、组织变化、关键约束和窗口。</td><td>约 20 分钟深聊，提前说明只讨论哪两个问题。</td></tr></tbody></table></div>
    <h3>一通电话怎么自然推进</h3>
    <div class='keypoints'><div class='kp'><b>先给来意和选择权</b>：“我看到你做过 XX，想确认一个方向；现在不方便我们就换时间，不耽误你。”</div><div class='kp'><b>先听他的工作，再讲岗位</b>：先确认项目和职责，岗位只讲与他真正有关的部分。</div><div class='kp'><b>追一个真实项目</b>：从“做了什么”追到“为什么这么做、卡在哪里、结果怎样、本人负责什么”。</div><div class='kp'><b>把犹豫问出来</b>：不问“你意愿强不强”，问“这件事最让你犹豫的是什么”。</div><div class='kp'><b>只约一个下一步</b>：深聊、补资料、推荐、暂缓或停止，选一个并定日期。</div></div>
    <h3>挂电话后，只留四行记录</h3>
    <div class='table-wrap'><table><thead><tr><th>记录项</th><th>写什么</th><th>示例</th></tr></thead><tbody><tr><td><b>事实</b></td><td>当前任务、本人范围、已确认的约束。</td><td>“负责仓储机器人现场部署；竞业至 10 月。”</td></tr><tr><td><b>判断</b></td><td>匹配在哪里，不确定在哪里。</td><td>“交付经验贴近；算法深度需下一轮核实。”</td></tr><tr><td><b>动机</b></td><td>真正的触发点和排序。</td><td>“更在意直属上级与业务空间，现金排第三。”</td></tr><tr><td><b>下一步</b></td><td>谁在什么时候做哪件事。</td><td>“顾问周三发岗位事实卡；候选人周五确认是否深聊。”</td></tr></tbody></table></div>
    <h3>这些情况不要硬推</h3>
    <div class='callout warn'><span class='tt'>先停一下，比强推进更专业</span>对方明确不希望再联系、竞业或保密边界没核清、职位核心条件明显不匹配、候选人只想拿信息比价、你无法解释公司与岗位的真实情况时，先记录原因并退出。保住信任，下一单才有机会。</div>`
  );

  rebuildSection(
    "skill-candidate",
    `<p class='subtitle'>这章只负责判断“为什么是这个人、现在能不能推”。电话负责收信息，推荐负责把结论讲给客户；这里不重复两边的话术，只把证据变成判断。</p>
    <h3>先用一张五维评估卡，不靠感觉下结论</h3>
    <div class='table-wrap'><table><thead><tr><th>维度</th><th>用人话怎么理解</th><th>必须拿到的证据</th><th>没有证据时</th></tr></thead><tbody><tr><td><b>做成过什么</b></td><td>他以前是否解决过和这个岗位相近的问题。</td><td>本人职责、资源约束、具体动作、结果和失败案例。</td><td>继续深聊一个真实项目，不写“经验丰富”。</td></tr><tr><td><b>怎么把事做成</b></td><td>他的能力和工作方式，放到新环境还能不能用。</td><td>怎样决策、带人、协作、处理冲突和不确定性。</td><td>用情境追问，不只听项目名称。</td></tr><tr><td><b>能不能长进新角色</b></td><td>新岗位比他现在大一档、变一类时，他是否有学习和适应空间。</td><td>过去如何处理陌生任务、扩大范围或改变方法。</td><td>把差距写出来，判断是“跳一跳”还是“差一层”。</td></tr><tr><td><b>为什么愿意来</b></td><td>这份机会是否真能解决他的职业诉求，而不是拿来比价。</td><td>离开的具体原因、优先级、行动强度和时间窗口。</td><td>先长期维护，不消耗客户面试机会。</td></tr><tr><td><b>能不能顺利入职并留下</b></td><td>薪酬、地点、家庭、竞业、反要约和组织适应是否可控。</td><td>底线条件、离职安排、其他流程、风险和修复方案。</td><td>标为待核实或高风险，不直接推荐。</td></tr></tbody></table></div>
    <div class='callout'><span class='tt'>国际团队的评估习惯</span>既看<b>已经做成的事</b>，也看<b>做事方式、未来适应空间、动机与文化环境</b>。这不是增加一套复杂测评，而是防止只凭履历和一通电话做决定。</div>
    <h3>深聊时，只追三层信息</h3>
    <div class='table-wrap'><table><thead><tr><th>层次</th><th>要问什么</th><th>听到什么才算有效</th></tr></thead><tbody><tr><td><b>事实</b></td><td>“这个项目你亲自负责哪一段？当时目标和约束是什么？”</td><td>边界清楚，能说出本人动作，不把团队结果都算在自己身上。</td></tr><tr><td><b>判断</b></td><td>“当时最难的取舍是什么？你为什么这么选？”</td><td>能讲选择、代价和失败，而不是只复述成功故事。</td></tr><tr><td><b>迁移</b></td><td>“如果放到这个岗位，哪一段你能直接复用，哪一段要重新学？”</td><td>知道自己的边界，也说得出补齐办法。</td></tr></tbody></table></div>
    <h3>动机不能只问一次，要在节点上复核</h3>
    <div class='keypoints'><div class='kp'><b>推荐前</b>：确认他愿不愿意以这个岗位的真实条件被推荐，而不是“先看看”。</div><div class='kp'><b>每轮面试后</b>：问兴趣是上升、下降还是不变；追问发生变化的具体原因。</div><div class='kp'><b>Offer 前</b>：把现金、长期激励、汇报线、地点、到岗时间、家人和反要约逐项问透。</div><div class='kp'><b>入职后</b>：核对最初承诺的任务、资源和支持是否兑现。</div></div>
    <h3>结论写成“优势、差距、风险、建议”四句话</h3>
    <div class='table-wrap'><table><thead><tr><th>字段</th><th>写法</th><th>不要这样写</th></tr></thead><tbody><tr><td><b>优势</b></td><td>“在 XX 条件下主导 XX，结果为 XX，和本岗的 XX 直接相关。”</td><td>“背景很好、经验丰富。”</td></tr><tr><td><b>差距</b></td><td>“没直接做过 XX，但有 XX 可迁移经验；需在首轮重点验证。”</td><td>“基本匹配。”</td></tr><tr><td><b>风险</b></td><td>“竞业到 XX；现公司有反要约可能；已约定在 XX 前确认。”</td><td>“稳定性待观察。”</td></tr><tr><td><b>建议</b></td><td>“建议推荐 / 补一轮信息 / 长期维护 / 停止，并说明唯一原因。”</td><td>“客户看看是否合适。”</td></tr></tbody></table></div>
    <h3>候选人不适合，也要留下对下一单有用的结论</h3>
    <p>不推荐不等于没有价值。记录他适合什么阶段、什么任务、什么条件下才会动，以及本次为什么不适合；这些信息回到人才库，下次才不会重复问、重复打扰。</p>`
  );

  appendPractice(
    "client-analysis",
    "<h3>接单现场：客户这么说，你怎么接</h3><div class='table-wrap'><table><thead><tr><th>客户原话</th><th>你先判断什么</th><th>更像人话的回应</th><th>当场落下什么</th></tr></thead><tbody><tr><td>“先推几个人看看。”</td><td>对方还没有定义岗位，也可能不愿投入时间。</td><td>“可以，我先用一小批样本帮您摸市场。但先帮我定一个底线：这个人进来最重要是解决哪件事？不然我推得越多，您筛得越累。”</td><td>约一个 15 分钟启动会；首批只做 5—10 人验证。</td></tr><tr><td>“预算你先别管，人好就行。”</td><td>预算不清会让候选人沟通失真。</td><td>“我理解您不想一开始把范围卡死。那我先按两个档去测：市场常见区间和您大致舒服的区间。三天后我带样本回来，我们再决定要不要碰更高的一档。”</td><td>记录预算区间、超预算谁批、何时校准。</td></tr><tr><td>“HR 跟就行，老板很忙。”</td><td>业务拍板人可能没有被真正拉进项目。</td><td>“流程我当然先跟 HR 对齐。只是前两位合适的人出来前，我想用 10 分钟确认一下老板最在意的取舍，避免把双方时间花在方向不对的人身上。”</td><td>明确用人经理 / 最终拍板人的出现节点。</td></tr><tr><td>“上一个人不行，换个更强的。”</td><td>要拆上一任失败原因，不能照着情绪升级 JD。</td><td>“我们先不急着把条件都加满。上一次最影响结果的是能力、资源、协作方式，还是预期没对齐？不同答案，来源公司会完全不同。”</td><td>写下上一任失败事实和本次必须避免的反例。</td></tr></tbody></table></div><div class='callout'><span class='tt'>收尾句</span>“我会把今天确认的内容整理成一页：已经定下来的、还待确认的、我先验证什么。您看完没问题，我们再正式开搜。”这句话既不讨好，也不显得在给客户上课。</div>"
  );

  appendPractice(
    "skill-deconstruct",
    "<h3>画像校准现场：把模糊要求问成可找的人</h3><div class='table-wrap'><table><thead><tr><th>模糊要求</th><th>不要顺着问</th><th>这样追问</th><th>得到的可执行结论</th></tr></thead><tbody><tr><td>“要有大厂背景。”</td><td>“哪些大厂？”</td><td>“您要的是复杂流程训练、资源协调能力，还是这个圈层的信誉？如果他在中型公司做过同样复杂的事，能不能算？”</td><td>把公司标签换成真实能力和可迁移来源。</td></tr><tr><td>“要能从 0 到 1。”</td><td>“做过 0 到 1 吗？”</td><td>“这次的 0 到 1，指把产品做出来、把团队搭起来，还是把第一批客户跑通？哪一个做不到就算失败？”</td><td>给“0 到 1”加具体场景、范围和验收结果。</td></tr><tr><td>“人要有创业心态。”</td><td>“抗压行不行？”</td><td>“他进来后最难受的现实是什么：资源少、目标会变、要带人，还是要自己下场？您能提供哪些支持？”</td><td>把性格词换成组织约束和真实工作方式。</td></tr><tr><td>“学历、行业、职级都不能放。”</td><td>“那我就按这个找。”</td><td>“这四项里哪一项是结果的必要条件？如果市场只给您三项，您最愿意保哪两项？”</td><td>排出 Must 的优先级，避免制造不存在的人。</td></tr></tbody></table></div><div class='callout tip'><span class='tt'>回传客户的说法</span>“我把要求分成了必须有、可以迁移和明确不适合三类。您确认这一版后，我就按这张卡去找；市场验证出来的事实，我们再一起改，不会在背后替您放条件。”</div>"
  );

  appendPractice(
    "skill-industry",
    "<h3>市场校准现场：把“找不到人”讲清楚</h3><div class='table-wrap'><table><thead><tr><th>验证后出现的情况</th><th>先别说什么</th><th>建议这样和客户聊</th><th>下一步</th></tr></thead><tbody><tr><td>同类人有，但全部超预算</td><td>“市场就这样，您得加钱。”</td><td>“这批人的市场价集中在 XX—XX，原因是他们同时具备 A 和 B。您现在有三种选择：保 A 放 B、提高现金，或把 B 拆给团队里另一位同事。您更愿意试哪一种？”</td><td>把三个方案分别对应到可寻访的人才池。</td></tr><tr><td>人有，大家都不愿听</td><td>“候选人太挑。”</td><td>“候选人不是否定岗位本身，而是反复问到 X。我们先补一段客户故事：业务为什么现在要做、他进来能拿到什么权责、三个月怎样证明进展。”</td><td>重写触达钩子，固定一周后看沟通率变化。</td></tr><tr><td>市场上没有完全同类</td><td>“这个岗位没法做。”</td><td>“完全一样的经历确实很少，但相邻有两条来源：A 带来业务经验，B 带来方法能力。我们可以各找三人让您比较，您再决定哪种迁移更能接受。”</td><td>建立双来源 Shortlist（短名单），让客户做取舍。</td></tr><tr><td>客户坚持全部条件</td><td>“那我再多找找。”</td><td>“可以继续找，但我不想给您一个虚假的交付承诺。按这组条件，我建议先保留这个职位，等预算或优先级变化再启动；现在我每两周给您更新一次窗口。”</td><td>降为观察项目，停止重投入触达。</td></tr></tbody></table></div>"
  );

  appendPractice(
    "sop-search",
    "<h3>寻访现场：第一条消息和第一通电话怎么不惹人烦</h3><div class='table-wrap'><table><thead><tr><th>场景</th><th>建议开场</th><th>不要这样说</th><th>你真正的目标</th></tr></thead><tbody><tr><td>第一次冷启动</td><td>“看到您在 XX 做过 XX 项目。我在帮一家同阶段公司找能解决 XX 的人，不确定是否适合您；想先用两分钟确认一下，您现在还在做这类问题吗？”</td><td>“有一个高薪机会，方便聊吗？”</td><td>确认项目相关性和可继续沟通的时间。</td></tr><tr><td>被动候选人说不看机会</td><td>“理解，我今天也不急着聊跳槽。您这段经验正好在我研究范围里，方便时我想请教一个问题；以后即使不合作，也希望别因为一通电话打扰到您。”</td><td>“您先听一下，机会真的很好。”</td><td>保住关系，约下一个轻触点。</td></tr><tr><td>对方先问是哪家公司</td><td>“我可以讲，但先确认两件事：您目前的竞业边界，以及您关心的是平台、岗位范围还是现金。确认不冲突后，我会把该讲的信息一次讲清。”</td><td>故弄玄虚，或没确认边界就全部透露。</td><td>建立保密边界，判断是否值得完整介绍。</td></tr><tr><td>已读不回</td><td>三到五天后补一句：“上次信息可能太长。这个岗位最有意思的不是 title，而是要把 XX 从 A 做到 B；如果不是您方向，回我一个‘不相关’就行，我不再打扰。”</td><td>连续追问“在吗”“方便吗”。</td><td>得到明确拒绝或一个低压力入口。</td></tr></tbody></table></div><div class='callout'><span class='tt'>触达原则</span>第一句不卖职位，先证明你知道他做过什么；第二句给他选择权；第三句只约一个很小的下一步。对方愿意回，不是因为你的公司介绍写得长，而是觉得你没有浪费他的时间。</div>"
  );

  appendPractice(
    "sop-call",
    "<h3>电话现场：不同状态的人，问法不一样</h3><div class='table-wrap'><table><thead><tr><th>候选人状态</th><th>先别急着讲岗位</th><th>这样问更容易得到真话</th><th>电话结束时要拿到什么</th></tr></thead><tbody><tr><td>明确在看机会</td><td>别立刻把职位卖完。</td><td>“你这次想换，最想解决的是钱、成长、老板、工作内容，还是地点？按顺序排一下，我才知道这单值不值得继续讲。”</td><td>前三个决策条件、其他流程、最早到岗时间。</td></tr><tr><td>只是随便看看</td><td>别把“看看”当成强意愿。</td><td>“如果半年内什么都不变，你会留下；那什么变化会让你认真考虑？我不需要一个漂亮答案，只需要知道真正的触发点。”</td><td>真实触发条件和下次联系的合理时间。</td></tr><tr><td>被前同事挖过很多次</td><td>别反复讲大平台、高薪。</td><td>“你应该已经听过不少类似机会。过去让你愿意继续听下去的，是哪种变化？这次我只讲与那个变化有关的部分。”</td><td>他对机会的筛选标准，以及这单是否命中。</td></tr><tr><td>刚入职 / 不方便动</td><td>别强行推进面试。</td><td>“刚开始一个新阶段，确实不适合被催决定。我先不推职位；等你对现在的平台有判断后，我们再约 15 分钟交换一下市场信息，可以吗？”</td><td>明确的轻触点和允许联系的方式。</td></tr></tbody></table></div><div class='callout tip'><span class='tt'>深聊时的追问</span>“你说这个项目做得不错，具体是哪件事由你负责？原来卡在哪里？你怎么做的？最后留下了什么数据或机制？”一连四问，能把‘参与过’和‘真正负责过’分开。</div>"
  );

  appendPractice(
    "skill-candidate",
    "<h3>判断现场：不靠感觉给候选人下结论</h3><div class='table-wrap'><table><thead><tr><th>你要判断的事</th><th>必要证据</th><th>当证据不足时怎么说</th></tr></thead><tbody><tr><td>他能不能做</td><td>本人负责范围、关键动作、结果指标、失败案例与协作对象。</td><td>“这段经历方向是对的，但我还差一个事实：你亲自负责到哪一级？这件事最后怎样衡量成不成？”</td></tr><tr><td>他是不是真的想来</td><td>换工作的推力、对新机会的拉力、愿意投入流程的时间。</td><td>“你不用现在承诺。我只想确认：如果客户安排下周面试，你是愿意认真比较，还是先保持了解？两种状态我会用不同节奏推进。”</td></tr><tr><td>他能不能入职</td><td>离职原因、通知期、竞业、家庭、其他流程和 Counter Offer 风险。</td><td>“很多人不是能力不匹配，而是最后一个月出了变量。我们现在把变量摊开，不是逼你表态，是避免双方白跑。”</td></tr><tr><td>风险能不能接受</td><td>履历一致性、授权、对客户和前雇主信息的边界。</td><td>“这件事不一定会否掉机会，但我不能替你猜。你把真实情况说完整，我再判断哪些可以解释、哪些必须停。”</td></tr></tbody></table></div><div class='callout'><span class='tt'>评估结论写法</span>不要写“意愿较强”。改写成：“当前主动看机会；排序为直属上级、业务空间、现金；已有一条流程；竞业至 X 月；若职责与面试反馈成立，愿意在两周内进入正式流程。”这才是团队可以接力的判断。</div>"
  );

  appendPractice(
    "sop-recommend",
    "<h3>推荐现场：客户只给半分钟，你要说清什么</h3><div class='script'><div class='s-line you'><span class='who'>发给客户</span><span class='txt'>“这个人我建议您先聊，不是因为简历漂亮，而是他在 XX 场景里做过和您现在最像的一件事：当时卡在 XX，他负责 XX，最后把 XX 从 A 做到 B。需要提前说明的是，他对 XX 的经验较少，我已和他确认了迁移逻辑；您面试时重点验证这一点就够了。”</span></div></div><div class='table-wrap'><table><thead><tr><th>常见场景</th><th>你该怎么做</th><th>不要做什么</th></tr></thead><tbody><tr><td>客户只回“收到”</td><td>24 小时后问：“您看完最担心哪一点？我先补事实，还是直接约 30 分钟让您判断？”</td><td>反复催“方便反馈吗”。</td></tr><tr><td>客户认为背景不够像</td><td>“您介意的是行业名称，还是他没经历过 X？如果是 X，我可以拿另一位同类人做对比，帮您判断哪种风险更小。”</td><td>硬说“能力强就行”。</td></tr><tr><td>候选人催进度</td><td>“客户还在比较，不代表拒绝。我今天会拿到他们具体卡点；如果只是流程慢，我告诉你真实时间，不让你空等。”</td><td>用“应该快了”安抚。</td></tr></tbody></table></div>"
  );

  appendPractice(
    "sop-interview",
    "<h3>面试推进现场：每次沟通都只解决一个卡点</h3><div class='table-wrap'><table><thead><tr><th>节点</th><th>对候选人怎么说</th><th>对客户怎么说</th></tr></thead><tbody><tr><td>面试前一天</td><td>“明天不是让你把所有经历都讲一遍。对方这轮主要想确认 XX；你准备两个最接近的案例，尤其讲清你本人做了什么、结果怎么验证。”</td><td>“明天建议您重点判断 XX；如果这轮仍想看 XX，请告诉我，我会提前让候选人准备，不然双方容易各讲各的。”</td></tr><tr><td>面试刚结束</td><td>“先别急着给总评价。你最有感觉的三个点是什么？哪里没发挥？对方追问最深的是哪一段？”</td><td>“我先收候选人的即时感受。您这边如果有疑虑，先给我最具体的一点，我补事实或安排下一轮，不用先写一段笼统评价。”</td></tr><tr><td>双方判断不同</td><td>“客户担心的是 XX，不等于已经否定你。这个点你有事实可以补吗？没有的话，我们也要诚实判断是否继续。”</td><td>“候选人对 XX 的解释是这样。您要的是更多事实、不同面试官验证，还是这确实是不可放宽项？”</td></tr></tbody></table></div><div class='callout'><span class='tt'>面试节奏</span>每轮结束后 24 小时内拿到“继续 / 停止 / 缺什么事实”三选一。没有结论就不凭空加轮次；加轮次必须写清新要验证的问题和拍板人。</div>"
  );

  appendPractice(
    "sop-offer",
    "<h3>录用现场：不是报价，而是提前把决定条件对齐</h3><div class='table-wrap'><table><thead><tr><th>场景</th><th>和候选人怎么聊</th><th>和客户怎么推进</th></tr></thead><tbody><tr><td>候选人说“我再想想”</td><td>“当然可以。你不是在比较一个数字，而是在比较几件事。现在最让你下不了决定的是哪一件？我把它拆开，不催你今天答复。”</td><td>“他没有简单拒绝，卡在 XX。这个点能否由用人经理再确认，还是只能调整条件？我今晚给您一个明确选择。”</td></tr><tr><td>候选人拿到更高报价</td><td>“高多少只是表面。我们一起看：多出来的钱能不能覆盖你换工作的核心风险？如果不能，这份 Offer 真正需要补的是职责、成长还是现金。”</td><td>“市场上已有 XX 的锚点。若不调现金，能否用签字费、职责、汇报线或长期激励解决？请只给一个能落地的方案。”</td></tr><tr><td>现公司要挽留</td><td>“被挽留很正常。你先别急着答应，回头看最初想走的原因：如果三个月后它还在，你愿意继续承受吗？”</td><td>“他会和现公司谈一次。我不建议让他今天就签离职；我们先确认您这边的 Offer、入职安排和欢迎动作都已准备好。”</td></tr></tbody></table></div><div class='callout tip'><span class='tt'>Offer 前最后一问</span>“如果客户按我们刚才确认的条件发正式 Offer，除了家人沟通、离职流程和竞业，还有没有任何一件事会让你不签？”问完要停下来等，不要急着替对方回答。</div>"
  );

  appendPractice(
    "sop-onboard",
    "<h3>入职现场：前 30 天不是寒暄，是确认承诺有没有兑现</h3><div class='table-wrap'><table><thead><tr><th>时间点</th><th>给候选人的自然问法</th><th>出现异常时</th></tr></thead><tbody><tr><td>拿 Offer 后 48 小时</td><td>“除了签字，还有没有谁需要你沟通？离职、竞业、家人、奖金或交接，哪个最可能让计划变？”</td><td>把每个变量写成 Owner、截止日和备选动作。</td></tr><tr><td>入职第一周</td><td>“这周先不问你适不适应。直属上级给你的第一件事是什么？和入职前说的是否一致？”</td><td>任务明显不一致，分别与候选人和客户核实，不急着定责。</td></tr><tr><td>第 30 天</td><td>“你现在最需要谁给你什么支持？团队、资源、权责、目标里，哪一项最影响你做成事？”</td><td>把抽象抱怨改成 1—2 个能观察的修复动作，约复查时间。</td></tr></tbody></table></div><div class='callout'><span class='tt'>对客户的同步</span>“我不需要您评价他好不好，只想确认三件事：第一件事是否对齐、直属上级是否投入、有没有一个问题需要我们趁早处理。早同步不是找麻烦，是保护这次招聘结果。”</div>"
  );

  appendPractice(
    "sop-payment",
    "<h3>回款现场：让系统替你盯住合同、发票和到账</h3><p>回款不是财务部门的事，也不是人选入职后才想起来的事。顾问负责把业务事实推进到可申请的状态，系统负责让材料、责任人和状态不丢失。</p>"
  );

  appendPractice(
    "sop-guarantee",
    "<h3>保证期现场：用系统提醒做双边跟进</h3><p>保证期不是等到最后一天才联系。把候选人和客户的触点放进同一条流程，才能在风险还可修复时被看见。</p>"
  );

  extendPractice(
    "client-analysis",
    `<h4>客户推进不顺时，先把合作规则拉回来</h4><div class='table-wrap'><table><thead><tr><th>现场情况</th><th>先判断</th><th>怎么说</th><th>什么时候升级</th></tr></thead><tbody><tr><td>推荐两轮都没有反馈</td><td>是人不准、岗位暂停，还是客户没有把项目排进优先级。</td><td>“我不想靠多推人换反馈。前两位里，您最不认可的是哪一项？如果岗位优先级变了也请直接说，我好把投入调回来。”</td><td>48 小时仍无结论，找约定的项目负责人确认继续、调整或暂停。</td></tr><tr><td>客户同时给了多家猎头</td><td>不是先抢速度，而是确认客户愿意如何比较质量。</td><td>“多家并行没问题。为了不重复消耗您，我想约定一个比较标准：您最看重背景、速度还是可入职性？我按这个标准给样本。”</td><td>拒绝任何反馈和比较规则时，降为低投入项目。</td></tr><tr><td>保密职位但客户不让讲任何信息</td><td>候选人无法判断，过度保密会降低高质量人选的回应。</td><td>“公司名可以晚一点讲，但我至少需要说清业务阶段、汇报对象、地点和这个岗位要解决什么；否则专业候选人不会进入流程。”</td><td>客户仍要求误导或隐瞒关键条件，停止对外触达。</td></tr></tbody></table></div>`
  );

  extendPractice(
    "skill-deconstruct",
    `<h4>画像冲突时，不替客户拍脑袋</h4><div class='table-wrap'><table><thead><tr><th>现场情况</th><th>先判断</th><th>怎么说</th><th>落下什么</th></tr></thead><tbody><tr><td>老板要“能打仗”，HR 要“稳定大厂背景”</td><td>两个人说的是不同风险：业务风险和组织风险。</td><td>“这两个条件不一定冲突，但要定优先级。第一年最不能失败的是增长、团队稳定，还是流程搭建？我按第一风险来找人。”</td><td>记录第一优先级，以及为了它可以放宽什么。</td></tr><tr><td>客户说“越快到岗越好”又要求完美匹配</td><td>时间和稀缺度是取舍，不是同时许愿。</td><td>“最快到岗的人和最像的人未必是同一批。我们先出两条线：一条追最快可入职，一条追最强匹配，您看哪条先走。”</td><td>两条来源、各自的周期和负责人。</td></tr><tr><td>用人经理只会说“看感觉”</td><td>不是不能做，而是需要把感觉拆成过去的成功案例。</td><td>“您上一次见到特别满意的人，他当时做过哪件事、给您什么感觉？我们先拿一个真人做参照，比抽象形容更准。”</td><td>一位正向标杆和一位明确反例。</td></tr></tbody></table></div>`
  );

  extendPractice(
    "skill-industry",
    `<h4>市场信息要变成客户能选的方案</h4><div class='table-wrap'><table><thead><tr><th>现场情况</th><th>先判断</th><th>怎么说</th><th>下一步</th></tr></thead><tbody><tr><td>客户要求“独角兽背景 + 低预算”</td><td>是预算真低，还是客户不知道同类人的总包与机会成本。</td><td>“这类人不是完全没有，但通常在 XX 区间。我们可以保留平台背景、放宽年限，或保留年限、接受相邻平台；您想先验证哪一条？”</td><td>每条路线各给 3 个匿名样本。</td></tr><tr><td>候选人集中在异地，客户坚持不搬迁</td><td>是必须线下，还是管理习惯还没调整。</td><td>“人才主要在 A 地。如果岗位必须在 B 地，周期会明显拉长；如果前 3 个月集中到岗、后续可混合，我们的人才池会大很多。”</td><td>确认地点底线、搬迁补贴和远程边界。</td></tr><tr><td>样本人都说公司故事不吸引人</td><td>不是“候选人难搞”，而是客户卖点没有打到目标人群。</td><td>“大家问的不是标题，而是这件事能不能做成、谁支持、做成后能得到什么。我们把这三句补出来，再测一周。”</td><td>更新触达版本，记录前后有效沟通率。</td></tr></tbody></table></div>`
  );

  extendPractice(
    "sop-search",
    `<h4>名单和触达卡住时，别盲目加量</h4><div class='table-wrap'><table><thead><tr><th>现场情况</th><th>先判断</th><th>怎么做 / 怎么说</th><th>何时换策略</th></tr></thead><tbody><tr><td>目标公司的人都联系过了</td><td>是人才池真的窄，还是只按公司名找人。</td><td>回到能力和项目：找上下游、相邻赛道、离职回流和合作方，不只扩公司数量。</td><td>首批 30 人没有新增有效来源时，和客户重看 Must。</td></tr><tr><td>候选人问“你怎么拿到我号码的”</td><td>对方在确认边界和专业性。</td><td>“我通过公开职业信息和行业研究定位到您，不会联系您的同事或现公司。若您不希望继续，我马上删除这次沟通记录。”</td><td>对方明确拒绝后标注免打扰，不再换号触达。</td></tr><tr><td>同一候选人被团队多人触达</td><td>是系统状态没有更新，还是职责不清。</td><td>先向候选人道歉：“是我们内部记录没同步好，后续只由我和您对接。”随后合并记录，不解释过多。</td><td>当天回查来源、负责人和去重流程。</td></tr></tbody></table></div>`
  );

  extendPractice(
    "sop-call",
    `<h4>电话里遇到难题，先保住信任再谈推进</h4><div class='table-wrap'><table><thead><tr><th>候选人原话</th><th>你先判断</th><th>自然回应</th><th>结束时的动作</th></tr></thead><tbody><tr><td>“先告诉我薪资，不然不聊。”</td><td>他可能效率优先，也可能只在试探市场。</td><td>“可以先说大区间，但我不想用一个数字误导你。这个岗位现金在 XX—XX，最终取决于范围和级别；这和你的底线差得远吗？”</td><td>确认是否值得继续讲职责与机会。</td></tr><tr><td>“你们猎头上次把我流程拖没了。”</td><td>他在测试你是否可靠，不能急着辩解。</td><td>“你这么谨慎很正常。你最不能接受的是没反馈、信息不实，还是被未经同意推荐？这次我能承诺的节奏和边界先讲清，不合适我们就到这里。”</td><td>复述双方同意的更新频率和授权边界。</td></tr><tr><td>“我现在不方便讲，怕同事看到。”</td><td>保密风险高，不能继续追问敏感信息。</td><td>“完全理解。你给我一个你方便的时间和方式；现在我只留一句，职位不涉及你现公司的任何信息。”</td><td>约私密时段，不在工作邮箱反复发送资料。</td></tr><tr><td>“我没有简历。”</td><td>高端被动人选常见，关键是先拿结构化事实。</td><td>“没关系，先不用为了我改简历。我们用 15 分钟过三段最相关的经历，我整理成一页让你确认后再谈下一步。”</td><td>约深聊，确认可对外呈现的信息范围。</td></tr></tbody></table></div>`
  );

  extendPractice(
    "skill-candidate",
    `<h4>复杂人选，怎样把风险判断说清</h4><div class='table-wrap'><table><thead><tr><th>现场情况</th><th>先判断</th><th>怎么追问</th><th>结论怎么落</th></tr></thead><tbody><tr><td>项目讲得很大，但说不清本人贡献</td><td>可能是团队成员，也可能有意放大。</td><td>“这个结果里，你亲自做的决策是哪一个？如果没有你，这个项目最可能卡在哪？”</td><td>无法落到本人动作和证据，只能按参与者而非 Owner 推荐。</td></tr><tr><td>能力强但从大公司跳初创</td><td>重点不是技术，而是资源、节奏和权限落差能否承受。</td><td>“你现在有的支持，在新公司大概率没有。资源少、目标变、需要亲自下场这三件事，哪一件最不适应？”</td><td>把适应风险写进推荐，不用“抗压强”代替。</td></tr><tr><td>有多份 Offer 或明显在比价</td><td>不一定不真诚，但必须确认排序和决策时间。</td><td>“你可以比较，我不回避。把每个机会的第一吸引点和最大顾虑排一下；这份机会排第几，什么变化会让它前进一位？”</td><td>若只比现金且无底线，提前标高流失风险。</td></tr><tr><td>家庭、地点或竞业还没谈清</td><td>这类不是小问题，晚发现最伤双方信任。</td><td>“这不是要你现在表态，是要把会影响入职的变量提前列出来：谁需要一起决定、最晚何时能确认？”</td><td>每项变量写 Owner、日期和备选方案。</td></tr></tbody></table></div>`
  );

  extendPractice(
    "sop-recommend",
    `<h4>推荐不是“发出去”，而是替客户减少比较成本</h4><div class='table-wrap'><table><thead><tr><th>现场情况</th><th>先判断</th><th>怎么处理</th><th>何时停止</th></tr></thead><tbody><tr><td>候选人只同意匿名介绍</td><td>他可能有保密顾虑，不代表不能推进。</td><td>先发匿名能力摘要和迁移逻辑；客户确认感兴趣后，再由候选人书面授权披露身份。</td><td>客户要求先看完整简历而候选人不同意，不发送。</td></tr><tr><td>客户要你一次发十份简历</td><td>通常是画像没定或没有时间筛。</td><td>“我先给您 2—3 个有对比价值的样本：一个最像、一个可迁移、一个边界案例。您告诉我哪种更接近，我们再扩。”</td><td>客户只要数量、不愿给任何反馈，回到市场验证。</td></tr><tr><td>候选人催你“快点推”</td><td>先确认授权和关键信息，不被情绪带节奏。</td><td>“我今天可以推进，但先把公司、薪酬范围、竞业和你最在意的点确认清。推得快不等于推得随便。”</td><td>关键事实无法确认时，宁可晚推，不裸推。</td></tr></tbody></table></div>`
  );

  extendPractice(
    "sop-interview",
    `<h4>面试出问题时，顾问要把问题变成下一轮验证</h4><div class='table-wrap'><table><thead><tr><th>现场情况</th><th>先判断</th><th>对候选人 / 客户怎么说</th><th>下一步</th></tr></thead><tbody><tr><td>客户临时改时间两次</td><td>是客观忙碌，还是项目优先级下降。</td><td>对候选人：“我不替客户找借口，正在确认优先级和新时间；明天 X 点前给你明确答复。”对客户：“若本周无法排，请确认项目是否暂缓，避免候选人误判。”</td><td>没有明确时间就暂停候选人预期管理。</td></tr><tr><td>候选人面得不好，但业务能力可能够</td><td>是表达失常、准备不足，还是确实没有证据。</td><td>“客户卡在 XX。你不是重讲一遍经历，而是补一个能证明 XX 的案例；你有吗？”</td><td>有证据则补充材料或安排针对性复面；没有则诚实停止。</td></tr><tr><td>面试官意见相反</td><td>不是让候选人多见一轮，而是先确认分歧问题。</td><td>“两位关注点不同：一位担心 XX，一位认可 XX。下一轮只验证 XX，并请最终拍板人参加。”</td><td>没有新验证问题，不增加面试轮次。</td></tr><tr><td>候选人面后兴趣下降</td><td>先听真实失望点，别急着洗白公司。</td><td>“是哪一句话、哪件事让你降温？我先确认这是信息误差、可以补的条件，还是你不想接受的现实。”</td><td>能补则安排负责人澄清；不能补则尽早止损。</td></tr></tbody></table></div>`
  );

  extendPractice(
    "sop-offer",
    `<h4>Offer 卡住，先拆成一个可以解决的问题</h4><div class='table-wrap'><table><thead><tr><th>现场情况</th><th>先判断</th><th>怎么说</th><th>当场动作</th></tr></thead><tbody><tr><td>客户审批迟迟不下</td><td>是流程慢、预算未批，还是客户在犹豫。</td><td>“我需要一个真实状态，方便我管理候选人预期。现在卡在谁、缺哪项材料、最晚哪天有结论？”</td><td>把审批 Owner、截止日和备选方案写清。</td></tr><tr><td>候选人要和家人商量</td><td>不是拖延，而是共同决策还没进入流程。</td><td>“完全应该商量。你回去不用替公司解释，我给你一页条件和你最在意的问题；你们讨论完，明晚我只听结论和剩下的疑问。”</td><td>提供准确书面条件，不催当场决定。</td></tr><tr><td>长期激励讲不明白</td><td>高风险不是金额，而是归属、行权、回购和兑现条件不清。</td><td>“现金和长期激励要分开看。公司能否把已授予、归属节奏、行权价格、离职处理写成你能看懂的版本？”</td><td>未书面确认前，不把账面价值算进总包承诺。</td></tr><tr><td>候选人接受后突然要延后入职</td><td>先查离职、竞业、奖金还是家庭变量。</td><td>“延后本身不是问题，我需要知道是哪一个变量、可不可控、最晚何时能确定。我们一起给客户一个真实时间表。”</td><td>同步客户，重新确认岗位空窗能否承受。</td></tr></tbody></table></div>`
  );

  extendPractice(
    "sop-onboard",
    `<h4>从签 Offer 到入职，最怕这些临门变化</h4><div class='table-wrap'><table><thead><tr><th>现场情况</th><th>先判断</th><th>怎么说</th><th>修复动作</th></tr></thead><tbody><tr><td>离职被拖住或现公司强挽留</td><td>是手续问题，还是候选人动摇。</td><td>“你不用马上给我好消息。现在最难处理的是流程、情绪还是条件？我们先把事实说清，再判断要不要让客户参与。”</td><td>更新离职计划；必要时安排客户负责人确认欢迎和岗位安排。</td></tr><tr><td>入职前客户换了直属上级或工作范围</td><td>这会改变原先决定基础，不能默认候选人接受。</td><td>“这不是小调整。新汇报线和职责与原来差在哪？我先把变化讲完整，再让候选人判断是否还愿意入职。”</td><td>双方重新确认职责、权责和到岗意愿。</td></tr><tr><td>候选人第一周说“和想象不一样”</td><td>区分正常适应，还是承诺明显落空。</td><td>“先具体到一件事：任务、资源、老板、团队，哪一项和面试时不同？我们只处理最影响你留下的那一项。”</td><td>分别与直属上级核实，约一项修复动作和复查时间。</td></tr></tbody></table></div>`
  );

  extendPractice(
    "sop-payment",
    `<h4>回款不是催一句“付了吗”</h4><div class='table-wrap'><table><thead><tr><th>现场情况</th><th>先判断</th><th>怎么说</th><th>系统动作</th></tr></thead><tbody><tr><td>客户说“财务在排队”</td><td>确认是材料不全、验收未完成还是账期未到。</td><td>“我理解排队。为了不让它一直停在‘财务’，麻烦帮我确认：现在缺哪份材料、谁在审批、预计哪天提交付款？”</td><td>记录阻塞点、客户 Owner、预计付款日和下次跟进日。</td></tr><tr><td>发票被退回</td><td>先查抬头、税率、合同主体和验收要求，不先指责财务。</td><td>“这次退回的具体原因是什么？我们今天一次改全，避免来回占双方时间。”</td><td>更新发票版本与退回原因，重新设到账预期。</td></tr><tr><td>候选人已入职，但客户说“还在试用”</td><td>看合同约定的付款节点，不用口头习惯替代条款。</td><td>“我理解贵司要控制风险。我们先按合同确认本期条件是否已经满足；若条款确实和实际不同，请您给我书面流程，我同步负责人。”</td><td>合同、入职证明、发票和回款节点关联留档。</td></tr></tbody></table></div>`
  );

  extendPractice(
    "sop-guarantee",
    `<h4>保证期出异常，先修复，不急着找替代</h4><div class='table-wrap'><table><thead><tr><th>现场情况</th><th>先判断</th><th>怎么分别沟通</th><th>什么时候启动替补</th></tr></thead><tbody><tr><td>候选人抱怨老板或团队</td><td>是正常磨合、目标不清，还是文化与承诺失配。</td><td>对候选人：“先说一个最影响工作的具体场景。”对客户：“先不评价人好不好，确认目标、资源和沟通有没有偏差。”</td><td>双方确认无法修复的职责或关系冲突时。</td></tr><tr><td>客户说人选表现不及预期</td><td>先对照岗位评分卡，不能只听“感觉不行”。</td><td>“您期待的哪一项没有发生？是能力缺口、资源没给到，还是目标和原来不一样？请给我一个可观察例子。”</td><td>有明确能力失配且辅导无效，按合同处理。</td></tr><tr><td>候选人突然想离开</td><td>先确认是否已有外部 Offer、还是当前问题累积。</td><td>“你有离开的想法我会认真听，但先别急着做决定。最初选择这份工作的原因，现在还剩多少？哪一件事如果被解决，你愿意再给多久？”</td><td>候选人明确不可逆、客户也无法给修复方案时。</td></tr></tbody></table></div><div class='callout tip'><span class='tt'>保证期复盘</span>每次异常都要回填：最早信号出现在哪一关、当时有没有被问到、下次岗位画像或候选人评估该增加什么验证项。保证期不是售后，是下一单的学习环。</div>`
  );

  appendSystemGuide(
    "client-analysis",
    "<b>在 Dhunting 里这样落地</b><br>由<b>项目负责人</b>从「职位管理」新建或导入职位，并进入该职位的「职位对话」。Kickoff（项目启动会）结束后，不是把纪要放在微信：把待确认事项、拍板链和下一次校准时间写进职位对话，负责人设为自己，客户待办要有明确日期。<br><b>系统替你做什么：</b>所有人围绕同一个职位推进；任何人接手时，先看职位对话就知道这张单能不能启动，而不是翻聊天记录。"
  );

  appendSystemGuide(
    "skill-deconstruct",
    "<b>在 Dhunting 里这样落地</b><br>由<b>项目负责人 + 用人经理</b>在「职位详情 / 职位对话」确认岗位要求，再用「自定义寻访条件」把岗位成功定义翻成可执行的搜索范围。条件没有确认，不开启批量寻访任务。<br><b>系统替你做什么：</b>把客户口头需求变成全团队共用的搜索版本；后续市场验证要改条件时，在同一职位里留版本，而不是每个顾问各用一份 JD。"
  );

  appendSystemGuide(
    "skill-industry",
    "<b>在 Dhunting 里这样落地</b><br>由<b>负责顾问</b>先在职位对话中发起「自有人才库寻访」或 AI 寻访，必要时进入「Mapping 编辑」补目标公司和相邻来源。首批结果出来后，在职位对话里只给出一个结论：继续、调条件、调预算 / 职级或暂停。<br><b>系统替你做什么：</b>把“市场上找不到”变成看得见的样本和决策记录；系统推荐、人才库、Mapping 都服务同一张职位，不再各自成表。"
  );

  appendSystemGuide(
    "sop-search",
    "<b>在 Dhunting 里这样落地</b><br>由<b>寻访顾问</b>按顺序使用「自有人才库寻访」→ 系统推荐人选 → 外部招聘平台职位 / 人才导入 → Mapping 补盲区。每一轮只处理当前职位的名单，触达结果回到该人选的流程卡，不在 Excel 另起一套状态。<br><b>系统替你做什么：</b>先复用公司已有关系，再扩展外部来源；系统能看出人从哪里来、卡在触达还是沟通、下一步谁来做。"
  );

  appendSystemGuide(
    "sop-call",
    "<b>在 Dhunting 里这样落地</b><br>由<b>负责顾问</b>在候选人的职位流程卡上记录本次电话的结论，并选择唯一的下一步：继续深聊、推荐、暂缓、长期维护或停止。需要批量初筛时，可用系统的「AI 电话面试 / AI 约面」辅助收集结构化信息，但关键判断仍由顾问确认。<br><b>系统替你做什么：</b>电话不再只留在个人记忆里；每一位候选人都有当前状态、下一动作和负责人，团队能接力，主管能复盘。"
  );

  appendSystemGuide(
    "skill-candidate",
    "<b>在 Dhunting 里这样落地</b><br>由<b>负责顾问</b>在「人才管理 / 候选人详情」维护真实经历和关系信息，在该职位流程里维护匹配结论。能力、意愿、可入职性或风险缺任何一项，就把人留在“待核实”而不是直接推到推荐节点。<br><b>系统替你做什么：</b>同一位候选人的长期资产与本次职位判断分开保存；既不重复问人，也不把一次机会的结论误当成对这个人的永久标签。"
  );

  appendSystemGuide(
    "sop-recommend",
    "<b>在 Dhunting 里这样落地</b><br>由<b>负责顾问</b>先在系统做企业库查重，再从候选人流程发起「推荐人选」并生成「推荐报告」；<b>项目负责人</b>在需要时审核推荐报告。客户反馈必须回写到同一流程节点，不能只在群里说“先等等”。<br><b>系统替你做什么：</b>推荐前避免撞库和授权不清；推荐理由、客户疑虑、版本和责任人都留在一处，后面面试不会重新问一遍。"
  );

  appendSystemGuide(
    "sop-interview",
    "<b>在 Dhunting 里这样落地</b><br>由<b>负责顾问</b>从候选人流程发起「AI 约面」或创建面试链接，统一记录时间、形式、面试重点和确认状态；面后由顾问收齐双方反馈，再把流程推进到继续、补面或停止。<br><b>系统替你做什么：</b>系统替你守住约面确认和时间提醒；但“这一轮究竟要验证什么、能不能进下一轮”仍由顾问根据 SOP 给结论。"
  );

  appendSystemGuide(
    "sop-offer",
    "<b>在 Dhunting 里这样落地</b><br>由<b>项目负责人</b>在候选人流程添加 Offer，并把最终条件、预计入职日和关键风险同步到职位对话；系统的 Offer 提醒触发后，顾问继续做候选人和客户双线确认，而不是把“已发 Offer”当作成单。<br><b>系统替你做什么：</b>Offer 节点被正式锁住并可追踪；主管能看见哪些人卡在审批、比价、离职或竞业，不再靠每天追问顾问。"
  );

  appendSystemGuide(
    "sop-onboard",
    "<b>在 Dhunting 里这样落地</b><br>由<b>负责顾问</b>按系统的入职确认提醒更新候选人流程；客户确认入职后，职位和候选人自动进入保证期跟进。第 1 周、第 30 天的双边沟通结论回到同一流程，不另建私人提醒。<br><b>系统替你做什么：</b>从 Offer 到入职不掉线；入职异常能和原先承诺、面试记录放在一起判断，而不是只听一方说法。"
  );

  appendSystemGuide(
    "sop-payment",
    "<b>在 Dhunting 里这样落地</b><br>由<b>项目负责人</b>在入职确认后检查「合同管理」中的服务条款，按节点创建「发票管理」和「回款管理」记录；<b>财务 / 负责人</b>在系统确认到账，不用顾问口头报数。<br><b>系统替你做什么：</b>合同、发票、应收和实际到账进入一条链；谁在等客户资料、谁该催、何时升级，一眼可见。"
  );

  appendSystemGuide(
    "sop-guarantee",
    "<b>在 Dhunting 里这样落地</b><br>由<b>负责顾问</b>根据系统的保证期提醒，在候选人流程记录第 1 周、30 天和风险触点；<b>项目负责人</b>处理需要客户协同的异常。保证结束后，把人沉淀回「人才管理」的长期关系，而不是从项目里消失。<br><b>系统替你做什么：</b>保证期由系统提醒、顾问完成判断、负责人处理升级；成单后的关系继续变成下一张单的人才库和转介绍来源。"
  );

  const practiceSectionIds = [
    "client-analysis", "skill-deconstruct", "skill-industry", "sop-search",
    "sop-call", "skill-candidate", "sop-recommend", "sop-interview",
    "sop-offer", "sop-onboard", "sop-payment", "sop-guarantee"
  ];
  practiceSectionIds.forEach(mergeLegacyDeepIntoPractice);

  function foldPractice(sectionId) {
    const section = document.getElementById(sectionId);
    const heading = section?.querySelector(`:scope > h3[data-practice="${sectionId}"]`);
    const practice = heading?.nextElementSibling;
    if (!heading || !practice?.classList.contains("sop-practice")) return;
    const guide = practice.querySelector("[data-system-guide]");
    if (guide) section.insertBefore(guide, practice);
    const details = document.createElement("details");
    details.className = "sop-practice-fold";
    const summary = document.createElement("summary");
    summary.textContent = "展开场景话术与方法";
    details.appendChild(summary);
    while (practice.firstChild) details.appendChild(practice.firstChild);
    practice.replaceWith(details);
  }

  practiceSectionIds.forEach(foldPractice);

  organizeResearchLibrary(
    "skill-llm",
    "主文负责判断收入路径和第一瓶颈；这里把它拆到技术、岗位、候选人、专业场景和交付风险。每个模块都以可验证结果收口。",
    [
      {
        title: "接单前：先画清“模型到收入”的五段链",
        content: "<p>大模型岗位的本质不是有没有用过某个模型，而是公司卡在从能力到收入的哪一段。</p><table><thead><tr><th>链条</th><th>猎头要确认的事实</th><th>答不清意味着什么</th></tr></thead><tbody><tr><td><b>能力</b></td><td>模型相较替代方案，在什么任务上真的更好。</td><td>没有明确效果差异，可能只是功能包装。</td></tr><tr><td><b>任务</b></td><td>替代或增强哪一步人工工作，谁对结果负责。</td><td>没有任务边界，Agent 仍是演示。</td></tr><tr><td><b>数据与权限</b></td><td>数据来源、连接方式、访问权限、保留与审计。</td><td>大客户很难从试点进入采购。</td></tr><tr><td><b>可靠性</b></td><td>成功率、错误类型、评测、人工兜底和回放机制。</td><td>线上风险未被管理，不能承接高价值流程。</td></tr><tr><td><b>复制收入</b></td><td>按什么收费；第二个客户上线是否更快、续费是否成立。</td><td>仍是高人天项目服务，应按交付组织配人。</td></tr></tbody></table><div class='callout tip'><span class='tt'>接单开场</span>“先不用讲模型参数。您希望替客户完成的具体任务是什么？现在最先卡在效果、成本、系统接入、合规还是客户采用？”</div>"
      },
      {
        title: "按岗位找人：大模型技术职位地图",
        content: "<p>大模型岗位最容易因为名称相似而推错。下面先按工作对象和交付结果区分；拿到 JD 时先定位这一行，再判断公司实际处在哪一层。</p><table><thead><tr><th>职位</th><th>真正解决的问题</th><th>真经验要有的证据</th><th>优先来源</th><th>最常推错的人</th></tr></thead><tbody><tr><td><b>预训练</b></td><td>用大规模数据训练基础模型能力，处理数据、并行训练与稳定性。</td><td>训练规模、数据治理、并行策略、loss / 能力曲线和训练故障处理。</td><td>基础模型公司、大厂研究院、分布式训练 / ML 系统团队。</td><td>只做 LoRA 微调或调用开源模型的人。</td></tr><tr><td><b>后训练 / 对齐</b></td><td>用偏好、监督、强化学习或合成数据提升指令遵循、推理和安全。</td><td>奖励 / 偏好数据、评测集、能力与安全的取舍、线上效果。</td><td>LLM 研究、RL、推荐 / 搜索排序、模型安全团队。</td><td>只写 Prompt 或只做标注管理的人。</td></tr><tr><td><b>多模态</b></td><td>让模型理解和生成图像、视频、语音等非文本信息。</td><td>模态对齐、数据配比、评测，以及是否服务真实产品任务。</td><td>视觉语言模型、语音、视频、CV / NLP 交叉团队。</td><td>只做单模态 CV 模型、没接过语言与产品任务的人。</td></tr><tr><td><b>推理优化 / Serving</b></td><td>在质量可接受前提下降低延迟和成本、提升吞吐和稳定性。</td><td>请求规模、P95 延迟、吞吐、GPU 利用率、单位 token / 任务成本。</td><td>模型服务、云平台、芯片部署、高并发后端团队。</td><td>只做模型训练、没碰过线上服务约束的人。</td></tr><tr><td><b>ML Infra / 训练平台</b></td><td>让数据、训练、实验、评测和模型发布可复现、可规模化。</td><td>平台服务对象、训练效率、资源利用、故障恢复与研发效率改善。</td><td>机器学习平台、数据平台、分布式系统、云计算团队。</td><td>只写训练脚本、没有平台 Owner 经验的人。</td></tr><tr><td><b>Eval / 模型安全</b></td><td>定义任务质量、发现风险、建立发布门槛和红队机制。</td><td>评测集构建、失效分类、发布阈值、红队与修复闭环。</td><td>模型评测、安全、搜索质量、测试工程、领域专家团队。</td><td>只会手工测几个 case、没有标准与闭环的人。</td></tr><tr><td><b>RAG / 知识工程</b></td><td>让答案基于可追溯、权限受控的企业与行业知识。</td><td>召回 / 重排 / 引用、权限过滤、文档更新和错误追踪。</td><td>搜索、知识图谱、企业数据、信息抽取、行业软件团队。</td><td>只会调框架 Demo、没做过知识质量与权限的人。</td></tr><tr><td><b>Agent / 工具调用</b></td><td>让模型在受控条件下规划、调用工具、完成多步任务。</td><td>任务成功率、工具失败处理、可观测性、降级和人工接管。</td><td>分布式系统、工作流引擎、自动化测试、AI 应用平台团队。</td><td>只会写 Prompt、没有生产环境失败处理的人。</td></tr></tbody></table><div class='callout tip'><span class='tt'>职位澄清问题</span>客户说“招 Infra”时，先问：“是训练 Infra、推理 Serving、数据平台还是 Agent 运行平台？服务谁、要改善哪个指标？”这四种人才来源几乎不重叠。</div>"
      },
      {
        title: "技术地图：五层能力各自解决什么问题",
        content: "<table><thead><tr><th>技术层</th><th>本质问题</th><th>真经验的证据</th><th>常见误判</th></tr></thead><tbody><tr><td><b>基础模型与后训练</b></td><td>在特定能力、数据或安全约束下提升模型表现。</td><td>能说清数据取舍、训练策略、评测集与代价。</td><td>微调过开源模型就自称基座经验。</td></tr><tr><td><b>推理与平台</b></td><td>把质量、延迟、吞吐与成本放到可接受区间。</td><td>有前后延迟、吞吐、单位任务成本与质量损失数据。</td><td>只做接口封装却称模型 Infra。</td></tr><tr><td><b>检索与企业知识</b></td><td>让回答基于可追溯的内部和权威信息。</td><td>说得出召回、重排、引用、权限过滤和错误案例。</td><td>搭过简单 RAG 就能做企业知识系统。</td></tr><tr><td><b>Agent 与可靠性</b></td><td>让多步任务、工具调用和异常处理可控。</td><td>有 Eval、失败分类、重试、降级、人工接管与观测。</td><td>把 Prompt 调优当成可靠性工程。</td></tr><tr><td><b>交付与治理</b></td><td>让系统进得去、管得住、被使用且可复用。</td><td>接过系统、配过权限、做过上线和采用指标。</td><td>只做 Demo 的产品经理被当成企业 AI 负责人。</td></tr></tbody></table><div class='callout warn'><span class='tt'>一条基本原则</span>模型、Agent、RAG、FDE 不是同一类人。岗位画像必须写出他在这五层中的<b>主责层、协作接口和交付指标</b>。</div>"
      },
      {
        title: "岗位怎么拆：哪个瓶颈，先补哪一类人",
        content: "<table><thead><tr><th>客户的真实症状</th><th>第一优先岗位</th><th>候选人应有的结果</th><th>不该先招什么</th></tr></thead><tbody><tr><td>模型效果可以，但调用太贵或太慢</td><td>推理优化、模型服务、GPU / 平台工程。</td><td>延迟、吞吐、成本和质量损失的量化改进。</td><td>泛应用工程师。</td></tr><tr><td>回答不可靠，业务不敢放手</td><td>Eval、检索 / Grounding、Agent 可靠性、安全。</td><td>任务成功率、失败分类、降级和人工兜底。</td><td>只会写 Prompt 的角色。</td></tr><tr><td>数据和业务系统接不进来</td><td>企业平台、连接器、权限、安全、解决方案架构。</td><td>接入过的系统、权限设计、审计和上线进度。</td><td>只做前端体验的 AI PM。</td></tr><tr><td>客户都要定制，交付越做越重</td><td>行业产品、工作流设计、FDE、实施、客户成功。</td><td>第二客户上线速度、配置复用率、续费或采用结果。</td><td>继续堆算法岗。</td></tr></tbody></table><div class='callout'><span class='tt'>岗位画像最低标准</span>写清一个<b>业务任务</b>、一个<b>验收口径</b>、一个<b>系统约束</b>和一个<b>复用目标</b>。缺任何一个，候选人无法判断成功标准。</div>"
      },
      {
        title: "候选人深聊：从“会什么”改问“留下什么结果”",
        content: "<table><thead><tr><th>候选人类型</th><th>有效问题</th><th>好答案应该包含</th></tr></thead><tbody><tr><td><b>模型 / 后训练</b></td><td>“你负责的能力提升，最后通过什么评测证明？代价是什么？”</td><td>数据、评测、指标、取舍与上线影响。</td></tr><tr><td><b>推理 / 平台</b></td><td>“你优化过的任务，延迟、吞吐、成本和质量如何一起取舍？”</td><td>规模、前后数据、故障处理和可复用平台能力。</td></tr><tr><td><b>RAG / 知识工程</b></td><td>“用户为什么信这个答案？错误引用或权限穿透怎么发现？”</td><td>检索链路、引用、权限、评测与人工审核。</td></tr><tr><td><b>Agent / 产品</b></td><td>“多步任务最容易在哪一步失败？失败后如何降级或转人工？”</td><td>任务口径、工具治理、失败分类、监控和采用数据。</td></tr><tr><td><b>FDE / 交付</b></td><td>“第一个客户和第二个客户的上线过程差在哪里？”</td><td>系统接入、客户角色、复用资产、时长和商业结果。</td></tr></tbody></table><div class='callout tip'><span class='tt'>候选人话术</span>“我不只看你用过什么模型，更想知道你最终替谁完成了什么任务，出了错谁接住，下一位客户能不能复用。”</div>"
      },
      {
        title: "专业模型、通专融合与行业智能体：科学和产业怎么落地",
        content: "<p>先分清四件事：<b>通用模型</b>提供语言、多模态和通用推理；<b>专用模型</b>解决高价值领域中的专业表示或预测；<b>通专融合</b>让通用模型负责理解和编排，领域数据、规则、求解器或专用模型负责验证和执行；<b>专用智能体</b>则把这些能力接进一个可审计的工作流。它们不是四个营销词，而是四种不同的人才与交付组织。</p><table><thead><tr><th>场景</th><th>真正的技术组合</th><th>客户为什么会买单</th><th>该找什么人</th><th>必须验证什么</th></tr></thead><tbody><tr><td><b>法律</b></td><td>通用模型 + 权威内容 / 检索 + 引用与权限 + 律师评测。</td><td>缩短检索、审阅和起草时间，同时能追溯依据。</td><td>法律产品、知识工程、Eval、安全、实施。</td><td>引用准确率、权限隔离、律师复核和事务所采用。</td></tr><tr><td><b>生物与药物研发</b></td><td>科学文献、组学 / 结构数据、专用预测模型、实验设计与湿实验回流。</td><td>减少候选筛选和实验迭代时间，而不是“回答更像专家”。</td><td>计算生物、ML for Science、生信、科学数据平台、实验自动化。</td><td>前瞻实验是否验证；失败数据怎样回流，不只看离线指标。</td></tr><tr><td><b>工业软件</b></td><td>通用模型 + CAD / CAE / PLM / MES 数据 + 工程规则、仿真或求解器 + 审批工作流。</td><td>缩短设计、诊断、工艺与文档流转，并降低工程错误。</td><td>工业领域产品、工程数据、仿真 / 求解、Agent 工程、现场交付。</td><td>能否接入现有系统；专家是否认可；是否减少返工或交付周期。</td></tr><tr><td><b>先进材料</b></td><td>材料数据、物理 / 化学模拟、性质预测、实验设计和实验室回流。</td><td>提高命中率、缩短试验周期，而不是生成一份材料报告。</td><td>材料信息学、计算化学、科学 ML、实验数据与自动化。</td><td>候选配方是否经实验复现；从预测到实验的周期是否变短。</td></tr><tr><td><b>开发者与数据平台</b></td><td>代码 / 数据上下文、工具调用、权限治理、评测与企业部署。</td><td>提高工程效率且不牺牲安全与可控性。</td><td>DevEx、代码检索、数据平台、Agent 可靠性、企业产品。</td><td>真实任务完成率、代码 / 数据安全、团队采用和复用率。</td></tr></tbody></table><div class='callout warn'><span class='tt'>垂直 AI 的本质</span>不是给通用模型换一层行业提示词，而是同时拥有<b>专业数据或约束、可验收任务、专家验证、工作流入口与可复制交付</b>。接单时先问客户：你们要替代哪一步工作，最终由谁用什么证据验收？</div>"
      },
      {
        title: "上线与复盘：企业 AI 最常见的五种失败",
        content: "<table><thead><tr><th>失败模式</th><th>最早信号</th><th>该补的人或机制</th></tr></thead><tbody><tr><td><b>没有验收</b></td><td>所有人都说效果不错，但没有任务成功率和业务指标。</td><td>产品负责人、Eval、业务 Owner 和上线口径。</td></tr><tr><td><b>权限与数据卡住</b></td><td>Demo 有数据，上线拿不到数据或无法访问。</td><td>连接器、数据治理、身份权限、安全合规。</td></tr><tr><td><b>成本失控</b></td><td>调用量一增长，毛利快速变差。</td><td>推理优化、模型路由、FinOps、产品限额设计。</td></tr><tr><td><b>Agent 不可控</b></td><td>多步任务错误难复现，只能不停改 Prompt。</td><td>任务 Eval、可观测性、工具治理、降级和人工接管。</td></tr><tr><td><b>客户不采用</b></td><td>买了席位但低频使用，流程没有改变。</td><td>行业产品、实施、客户成功、组织推广与培训。</td></tr></tbody></table><div class='callout'><span class='tt'>复盘问题</span>“这次失败发生在模型、数据、系统、流程还是采用？它下一次会自动避免，还是还要靠某个人记住？”只有前者才形成产品和组织资产。</div>"
      }
    ]
  );

  function collapseFdeReference() {
    const section = document.getElementById("skill-fde");
    const practice = section?.querySelector(":scope > .deep");
    if (!practice || practice.closest("details")) return;
    const details = document.createElement("details");
    details.className = "research-more fde-reference";
    const summary = document.createElement("summary");
    summary.textContent = "候选人判断、谈薪与场景话术（需要时展开）";
    details.appendChild(summary);
    section.insertBefore(details, practice);
    details.appendChild(practice);

    const faq = details.nextElementSibling;
    if (faq?.classList.contains("faq")) {
      const faqDetails = document.createElement("details");
      faqDetails.className = "research-more fde-reference";
      const faqSummary = document.createElement("summary");
      faqSummary.textContent = "FDE 常见卡点速查（需要时展开）";
      faqDetails.appendChild(faqSummary);
      section.insertBefore(faqDetails, faq);
      faqDetails.appendChild(faq);
    }
  }

  collapseFdeReference();

  const industryCrosslinks = {
    "skill-embodied": "具身公司真正进入客户现场后，岗位常被叫作机器人部署、应用工程或现场集成。若团队有可复制的平台，且要把现场经验回流产品，可继续看 <a href=\"#skill-fde\">FDE：跨行业落地岗位</a>。",
    "skill-llm": "大模型公司开始从试点进入多客户部署时，最缺的往往不是再加一名算法工程师，而是能接系统、控质量、沉淀交付方法的人。符合这个问题时，再看 <a href=\"#skill-fde\">FDE：跨行业落地岗位</a>。",
  };
  Object.entries(industryCrosslinks).forEach(([id, content]) => {
    const section = document.getElementById(id);
    const library = section?.querySelector(".deep-reference");
    if (!section || !library || section.querySelector(":scope > .industry-crosslink")) return;
    const block = document.createElement("div");
    block.className = "industry-crosslink";
    block.innerHTML = `<b>什么时候需要看 FDE</b><span>${content}</span>`;
    section.insertBefore(block, library);
  });

  const sectionTitles = {
    "process-catalog": "流程目录",
    "sop-flow": "做单总览：一张职位单的判断顺序",
    "client-analysis": "客户分析",
    "skill-deconstruct": "岗位解构",
    "skill-industry": "市场验证",
    "skill-embodied": "具身智能",
    "skill-llm": "大模型",
    "skill-fde": "FDE（前线部署工程师）",
    "sop-search": "寻访：先建池，再触达",
    "exec-mapping": "中高端人才寻访",
    "sop-channel": "公司人才库与渠道管理",
    resume: "简历判断",
    "skill-firstcall": "首次电话准备",
    "sop-call": "电话沟通",
    "skill-candidate": "候选人判断",
    "rel-refer": "人才关系经营与转介绍",
    "sop-recommend": "推荐",
    "sop-interview": "面试管理",
    "sop-offer": "录用沟通（Offer）",
    "sop-onboard": "入职跟进",
    "sop-payment": "回款",
    "sop-guarantee": "保证期",
    "skill-bd": "BD 电话",
    "client-dev": "客户开发",
    culture: "团队协作",
    essence: "职业能力",
    "faq-center": "问题速查",
    deliverables: "做单交付物",
    tools: "系统与资料",
    path: "60 天新人训练",
    mentor: "导师带教",
    risk: "全流程风险处理",
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
    "client-analysis": ["这是不是一张能做的单", "启动会必须确认什么", "谁影响决策、谁最终拍板", "什么情况下及时停单", "接单时怎么把问题问透"],
    "skill-deconstruct": ["先定义到岗后要交付什么", "把岗位写成可找人的画像", "和客户定下必要取舍", "怎样把画像交给寻访", "画像不清时怎么校准"],
    "skill-industry": ["用首批样本验证市场", "市场验证后给出什么结论", "什么时候需要补行业研究", "长期激励何时影响寻访", "市场不匹配时怎么沟通"],
    "skill-embodied": ["具身大脑到底管什么", "公司走到哪一步", "公司靠什么赚钱", "美国五条具身大脑路线"],
    "skill-llm": ["公司靠哪一层赚钱", "瓶颈对应什么人才", "美国大模型产业怎么分", "接单前必须问清什么"],
    "skill-fde": ["FDE 到底解决什么问题", "为什么企业开始需要这类人", "薪酬怎么判断", "候选人怎么筛", "怎样辅导候选人", "怎样判断一家公司是真 FDE", "从哪里找人"],
    "sop-flow": ["客户为什么付费", "四种不确定怎么解决", "一张单只过六道关", "每关要拿到什么证据", "国际团队怎样把流程做稳"],
    "sop-search": ["先判断卡在名单还是方向", "怎样搭一张可用的人才池", "每天怎样推进寻访", "找不到人时怎么处理", "寻访开场怎么说"],
    "sop-call": ["电话到底要拿到什么", "不同状态先解决什么", "一通电话怎么自然推进", "挂电话后留什么", "什么情况别硬推"],
    "skill-candidate": ["用五维评估卡判断", "深聊只追哪三层信息", "动机怎样动态复核", "怎样写出判断结论", "不推荐的人怎么沉淀"],
    "sop-recommend": ["什么情况先别急着推荐", "发推荐前必须核实什么", "推荐语怎样让客户看懂", "发出后怎样拿到反馈", "推荐时到底该说什么"],
    "sop-interview": ["面试为什么会卡住", "候选人面前要准备什么", "客户面前要确认什么", "面后怎样推动决定", "面试辅导怎么聊"],
    "sop-offer": ["不同候选人怎样推进 Offer", "先弄清他真正看重什么", "谈 Offer 前必须问透什么", "犹豫、比价、挽留时怎么聊", "客户卡审批或压价怎么推"],
    "sop-onboard": ["入职前先排查哪些风险", "候选人这条线怎么跟", "客户这条线怎么跟", "双方信息怎样对齐", "入职后第一个月怎么跟"],
    "sop-payment": ["开票前材料怎么核对", "不同节点怎样催回款", "系统怎样盯住回款", "回款卡住时怎么升级"],
    "sop-guarantee": ["每周怎么听出真实状态", "发现异常先怎么处理", "过保后怎样继续经营关系", "保证期双边跟进怎么做"],
    resume: ["为什么先看简历再打电话", "简历先拆哪几部分", "初筛时一定抓住的信息", "哪些红旗必须核实", "常见包装怎么识别"],
    "skill-firstcall": ["一通电话的六段结构", "15 秒怎么介绍自己", "答不上来时怎样处理", "打完电话核对什么"],
    "exec-mapping": ["什么时候要画人才地图", "人才地图怎么用", "四步怎么做", "怎么打开中高端候选人"],
    "sop-channel": ["人才库要记录什么", "每周怎么维护人才库", "外部渠道各解决什么", "渠道怎么复盘"],
    "rel-refer": ["关系经营的目标", "什么时候要转介绍", "关系记录怎么写"],
    "skill-bd": ["打电话前先准备什么", "怎样让客户愿意听下去", "怎样摸清真实需求", "怎样讲清你的价值", "客户拒绝时怎么继续"],
    "client-dev": ["一次客户拜访怎么安排", "拜访前准备哪些事实", "怎样持续拿到客户需求"],
    path: ["先判断新人缺什么", "前 10 天先练什么", "第 11—30 天怎么陪跑", "第 31—60 天如何独立做单", "第 60 天怎样定下一步"],
    "cases-win": ["海外营销主管案例", "海外销售经理案例（一）", "海外销售经理案例（二）", "区域运营总监案例", "零售运营主任案例"],
    "cases-fail": ["入职 3 天被辞退", "谈判为什么谈崩", "候选人为什么接了不去"],
    risk: ["接单风险", "推荐风险", "面试与 Offer 风险", "入职和过保风险", "怎样和候选人说"],
  };

  const sectionBriefs = {
    "client-analysis": ["01 单子准入", "这单值不值得投入", "HC、预算、拍板人、反馈节奏", "单子评分卡", "事实不全，只做低投入验证"],
    "skill-deconstruct": ["02 岗位定义", "客户真正要解决什么", "6 个月交付、Must、反例、目标公司", "岗位 Scorecard", "客户未确认，不大规模寻访"],
    "skill-industry": ["03 市场验证", "市场上的人和条件是否真实", "首批样本、薪酬、来源与候选人意愿", "市场校准结论", "先校准，不先做行业报告"],
    "sop-search": ["03 市场验证", "先找谁、先验证什么", "目标公司、人才分层、触达优先级", "Longlist", "每个人必须有状态和下一步日期"],
    "exec-mapping": ["03 市场验证", "中高端人选在哪里、何时可谈", "组织变化、关键经历、影响范围、窗口", "人才地图", "没有关系和时机，不硬推职位"],
    "sop-channel": ["03 市场验证", "怎样把接触沉淀为公司人才资产", "人才状态、来源、关系与下一步", "人才库与渠道看板", "人才库不是简历硬盘"],
    resume: ["04 候选人判断", "谁值得花时间深聊", "经历真实性、任务匹配、稳定性", "初筛记录", "简历只是线索，不是结论"],
    "skill-firstcall": ["04 候选人判断", "第一次电话要拿到什么", "当前任务、动机、薪酬、流程、风险", "First Call 记录", "事实不全，不进入推荐讨论"],
    "sop-call": ["04 候选人判断", "电话不是介绍岗位", "当前任务、触发点、约束、下一步", "通话结论", "每通电话必须落到下一动作"],
    "skill-candidate": ["04 候选人判断", "这个人能做、想做、能来吗", "能力、动机、可入职性、风险", "候选人评估卡", "四项缺一项，就继续核实"],
    "rel-refer": ["03 市场验证", "如何把一次接触变成长期资产", "关系状态、行业信息、转介绍窗口", "关系记录", "没有价值交换，不硬要转介绍"],
    "sop-recommend": ["05 双边决策", "为什么推荐他，而不是另一个人", "任务匹配、动机、风险、可验证点", "推荐报告", "客户看完 30 秒应能决定是否约聊"],
    "sop-interview": ["05 双边决策", "每轮面试到底要验证什么", "面试问题、双方顾虑、反馈时点", "面试决策表", "没有新问题的面试不增加轮次"],
    "sop-offer": ["05 双边决策", "双方接受条件能否同时成立", "年包、成长、风险、Counter Offer", "Offer 接受计划", "条件未锁定，不把 Offer 当成交"],
    "sop-onboard": ["06 结果保护", "如何降低入职前后反悔", "离职进度、直属上级、任务预期、适应风险", "30/60/90 跟进表", "风险出现先修复，不先追责"],
    "sop-payment": ["06 结果保护", "服务如何变成现金回款", "开票材料、付款人、账期、升级路径", "回款表", "入职当天就启动回款动作"],
    "sop-guarantee": ["06 结果保护", "如何让人选留下并变成内线", "任务、上级、团队、情绪、离职信号", "保证期触点表", "不只问“还好吗”"],
    "skill-bd": ["07 客户经营", "怎样把陌生联系变成下一次会面", "客户阶段、人才痛点、现有招聘方式", "BD 记录", "没有明确下一步，不算有效 BD"],
    "client-dev": ["07 客户经营", "怎样从交单变成共同规划", "组织变化、缺口、竞品人才流动", "客户账户计划", "先给行业判断，再谈合作"],
    "skill-embodied": ["行业与岗位判断", "具身公司现在究竟缺什么人", "真实任务、稳定运行、复制交付、单位经济", "行业判断卡", "先把客户的第一瓶颈问清"],
    "skill-llm": ["行业与岗位判断", "大模型公司现在究竟缺什么人", "收入形态、可靠性、系统接入、交付复用", "行业判断卡", "不把模型知识当成岗位画像"],
    "skill-fde": ["跨行业岗位工具包", "FDE 是否真的解决交付问题", "产品底座、交付结果、现场回流、组织归属", "FDE 岗位判断卡", "不满足产品化条件，不按 FDE 寻访"],
    risk: ["全流程风控", "什么情况必须核实、记录或停止", "履历、竞业、授权、Offer 与入职异常", "风险记录", "发现重大失信，不用侥幸推进"],
  };
  Object.entries(sectionBriefs).forEach(([id, brief]) => {
    const section = document.getElementById(id);
    const heading = section?.querySelector(":scope > h2");
    if (!section || !heading || section.querySelector(":scope > .sop-brief")) return;
    const block = document.createElement("div");
    block.className = "sop-brief";
    block.innerHTML =
      `<span class="sop-brief-stage">${brief[0]}</span>` +
      `<b>${brief[1]}</b>` +
      `<p><span>本章只解决</span>${brief[2]}<i></i><span>完成后留下</span>${brief[3]}</p>`;
    heading.insertAdjacentElement("afterend", block);
  });

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
      const tocLimit = 5;
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
      let chips = '<div class="toc-title">本章目录</div><div class="toc-chips">';
      h3s.slice(0, tocLimit).forEach((h, i) => {
        let txt = chapterTocLabels[id]?.[i] || compactHead(h.textContent);
        // 实战深化块单独标记
        const isDeep = h.textContent.includes("实战深化");
        if (isDeep) txt = "实战深化 · " + txt.replace(/^实战深化\s*[·:：]?\s*/, "");
        if (txt.length > 30) txt = txt.slice(0, 30) + "…";
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
