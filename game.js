const dictionary = [
  "人工智能",
  "最喜欢",
  "机器人",
  "天气",
  "今天",
  "熊猫",
  "喜欢",
  "学习",
  "火锅",
  "米饭",
  "面条",
  "汉堡",
  "竹子",
  "苹果",
  "香蕉",
  "面包",
  "不错",
  "AI",
  "吃",
  "真",
  "我"
]

const tokenCases = [
  {
    label: "天气",
    text: "今天天气真",
    teaching: "上下文一般，多个答案都有可能。",
    guessOptions: ["好", "热", "冷", "糟糕"],
    predictions: [
      { token: "好", prob: 55, color: "#1f7aec" },
      { token: "热", prob: 25, color: "#31b889" },
      { token: "不错", prob: 15, color: "#f59e0b" },
      { token: "冷", prob: 5, color: "#6b7a90" }
    ]
  },
  {
    label: "食物",
    text: "我最喜欢吃",
    teaching: "上下文较明确，概率开始倾斜。",
    guessOptions: ["火锅", "米饭", "面条", "汉堡"],
    predictions: [
      { token: "火锅", prob: 40, color: "#1f7aec" },
      { token: "米饭", prob: 30, color: "#31b889" },
      { token: "面条", prob: 20, color: "#f59e0b" },
      { token: "汉堡", prob: 10, color: "#6b7a90" }
    ]
  },
  {
    label: "熊猫",
    text: "熊猫最喜欢吃",
    teaching: "上下文非常明确，AI 会更有把握。",
    guessOptions: ["竹子", "苹果", "香蕉", "面包"],
    predictions: [
      { token: "竹子", prob: 80, color: "#1f7aec" },
      { token: "苹果", prob: 10, color: "#31b889" },
      { token: "香蕉", prob: 6, color: "#f59e0b" },
      { token: "面包", prob: 4, color: "#6b7a90" }
    ]
  }
]

const skillOptions = [
  { id: "weather", icon: "☂", name: "天气", desc: "查看明天是否下雨" },
  { id: "map", icon: "M", name: "地图", desc: "规划出行路线" },
  { id: "search", icon: "S", name: "搜索", desc: "查询开放时间" },
  { id: "calculator", icon: "=", name: "计算器", desc: "计算预算和时间" }
]

const agentSteps = [
  {
    toolId: "weather",
    route: "机器人 → 天气",
    result: "获得：明天有雨"
  },
  {
    toolId: "map",
    route: "机器人 → 地图",
    result: "获得：地铁 40 分钟"
  },
  {
    toolId: "search",
    route: "机器人 → 搜索",
    result: "获得：开放时间 9:00-21:00"
  }
]

const ragQuestions = [
  {
    id: "favorite",
    text: "小明最喜欢什么？",
    docIds: ["d1"],
    answer: "AI：我查到资料里写着“小明喜欢足球”，所以小明最喜欢足球。"
  },
  {
    id: "place",
    text: "小明住在哪里？",
    docIds: ["d2"],
    answer: "AI：我重新搜索同一个资料库，找到“小明住上海”，所以答案是上海。"
  },
  {
    id: "pet",
    text: "小明养了什么？",
    docIds: ["d3"],
    answer: "AI：问题变了，但资料库没变。我找到“小明养了一只猫”，所以答案是猫。"
  }
]

const ragDocs = [
  { id: "d1", title: "资料卡 A", text: "小明喜欢足球" },
  { id: "d2", title: "资料卡 B", text: "小明住上海" },
  { id: "d3", title: "资料卡 C", text: "小明养了一只猫" }
]

const hallucinationRounds = [
  {
    id: "months",
    title: "明显错误",
    tag: "判断真假",
    question: "一年有多少个月？",
    answer: "一年有13个月。",
    type: "judgment",
    explanation: "这是错的。一年有12个月。AI生成了一个看起来像答案的内容，但实际上完全错误。",
    reminder: "这就是最简单的 AI 幻觉。"
  },
  {
    id: "sunrise",
    title: "明显错误",
    tag: "判断事实",
    question: "太阳从哪里升起？",
    answer: "太阳每天从西边升起。",
    type: "judgment",
    explanation: "这是错的。太阳从东边升起。AI不会自动判断真假，它可能生成语法正确、但事实错误的答案。",
    reminder: "语言通顺，不代表内容真实。"
  },
  {
    id: "penguin",
    title: "真实幻觉",
    tag: "警惕虚构细节",
    question: "企鹅会飞吗？",
    answer: "会。\n\n企鹅能够连续飞行数百公里，最高时速可达120公里。",
    type: "judgment",
    explanation: "这是错的。企鹅不会飞。AI不仅给出了错误答案，还继续补充了距离和速度等虚构细节。",
    reminder: "这就是最危险的 AI 幻觉：细节越多，错误看起来越真实。"
  }
]

const bestTrainingReplyIndex = 2

const initialTrainingReplies = [
  {
    id: "laugh",
    text: "哈哈哈，那也太惨了吧",
    probability: 40
  },
  {
    id: "try",
    text: "那你下次努力",
    probability: 30
  },
  {
    id: "support",
    text: "这次没考好不代表你不行，我们可以一起看看哪里出了问题",
    probability: 20,
    best: true
  },
  {
    id: "unknown",
    text: "我不知道该说什么",
    probability: 10
  }
]

const state = {
  activeLab: "token",
  tokens: [],
  tokenTimers: [],
  particles: [],
  running: false,
  progress: 0,
  memoryItems: [],
  evictedItem: "",
  installedSkills: [],
  agentPlanSteps: [],
  activeQuestionId: "math",
  activeTokenScene: tokenCases[0],
  selectedGuess: "",
  activeRagQuestionId: "favorite",
  ragHitIds: [],
  ragTimer: null,
  hallucinationRoundIndex: 0,
  hallucinationPhase: "ready",
  hallucinationSelection: null,
  hallucinationSelectionCorrect: false,
  hallucinationTimer: null,
  trainingReplies: initialTrainingReplies.map((reply) => ({ ...reply })),
  trainingCurrentReplyIndex: 0,
  trainingProgress: 0,
  trainingMessage: "AI会根据当前概率选择一个回复。你可以点按钮，也可以左右滑动回复卡片。",
  trainingLearned: false,
  trainingTouchStartX: 0,
  trainingFeedbackTimer: null,
  isComplete: false
}

const nodes = {
  tabs: document.querySelectorAll(".nav-tab"),
  navScroll: document.querySelector(".nav-scroll"),
  mobileLabMenuButton: document.querySelector("#mobileLabMenuButton"),
  mobileCurrentLab: document.querySelector("#mobileCurrentLab"),
  mobileLabDrawer: document.querySelector("#mobileLabDrawer"),
  mobileLabOptions: document.querySelectorAll(".mobile-lab-option"),
  mobileDrawerBackdrop: document.querySelector(".mobile-drawer-backdrop"),
  mobileDrawerClose: document.querySelector(".mobile-drawer-close"),
  previousLabButton: document.querySelector("#previousLabButton"),
  nextLabButton: document.querySelector("#nextLabButton"),
  mobileLevelProgress: document.querySelector("#mobileLevelProgress"),
  labViews: document.querySelectorAll(".lab-view"),
  input: document.querySelector("#promptInput"),
  start: document.querySelector("#startButton"),
  runState: document.querySelector("#runState"),
  progress: document.querySelector("#progressValue"),
  tokenTrack: document.querySelector("#tokenTrack"),
  brainCore: document.querySelector("#brainCore"),
  brainMemory: document.querySelector("#brainMemory"),
  sentencePreview: document.querySelector("#sentencePreview"),
  guessHint: document.querySelector("#guessHint"),
  guessPanel: document.querySelector("#guessPanel"),
  guessOptions: document.querySelector("#guessOptions"),
  probList: document.querySelector("#probList"),
  tokenResult: document.querySelector("#tokenResult"),
  canvas: document.querySelector("#particleCanvas"),
  memoryInput: document.querySelector("#memoryInput"),
  rememberButton: document.querySelector("#rememberButton"),
  memoryCount: document.querySelector("#memoryCount"),
  slotGrid: document.querySelector("#slotGrid"),
  evictStrip: document.querySelector("#evictStrip"),
  memoryFeed: document.querySelector("#memoryFeed"),
  recallBox: document.querySelector("#recallBox"),
  recallButton: document.querySelector("#recallButton"),
  skillCount: document.querySelector("#skillCount"),
  skillGrid: document.querySelector("#skillGrid"),
  questionList: document.querySelector("#questionList"),
  toolRoute: document.querySelector("#toolRoute"),
  aiAnswer: document.querySelector("#aiAnswer"),
  agentResetButton: document.querySelector("#agentResetButton"),
  ragHitCount: document.querySelector("#ragHitCount"),
  ragQuestionList: document.querySelector("#ragQuestionList"),
  ragSearchButton: document.querySelector("#ragSearchButton"),
  ragRoute: document.querySelector("#ragRoute"),
  ragStatus: document.querySelector("#ragStatus"),
  ragDocList: document.querySelector("#ragDocList"),
  ragAnswer: document.querySelector("#ragAnswer"),
  hallucinationRoundBadge: document.querySelector("#hallucinationRoundBadge"),
  hallucinationRoundTrack: document.querySelector("#hallucinationRoundTrack"),
  hallucinationRoundNumber: document.querySelector("#hallucinationRoundNumber"),
  hallucinationRoundTitle: document.querySelector("#hallucinationRoundTitle"),
  hallucinationRoundTag: document.querySelector("#hallucinationRoundTag"),
  hallucinationQuestion: document.querySelector("#hallucinationQuestion"),
  hallucinationAiCard: document.querySelector("#hallucinationAiCard"),
  hallucinationAiState: document.querySelector("#hallucinationAiState"),
  hallucinationGenerating: document.querySelector("#hallucinationGenerating"),
  hallucinationAnswerContent: document.querySelector("#hallucinationAnswerContent"),
  hallucinationRunButton: document.querySelector("#hallucinationRunButton"),
  hallucinationJudgmentActions: document.querySelector("#hallucinationJudgmentActions"),
  hallucinationJudgmentButtons: document.querySelectorAll(".hallucination-judge"),
  hallucinationFeedback: document.querySelector("#hallucinationFeedback"),
  hallucinationNextButton: document.querySelector("#hallucinationNextButton"),
  hallucinationSummary: document.querySelector("#hallucinationSummary"),
  hallucinationResetButton: document.querySelector("#hallucinationResetButton"),
  trainingProgressBadge: document.querySelector("#trainingProgressBadge"),
  trainingMessage: document.querySelector("#trainingMessage"),
  trainingReplyCard: document.querySelector("#trainingReplyCard"),
  trainingReplyText: document.querySelector("#trainingReplyText"),
  trainingFeedback: document.querySelector("#trainingFeedback"),
  trainingBadButton: document.querySelector("#trainingBadButton"),
  trainingGoodButton: document.querySelector("#trainingGoodButton"),
  trainingResetButton: document.querySelector("#trainingResetButton"),
  trainingProbabilityList: document.querySelector("#trainingProbabilityList"),
  trainingProgressCard: document.querySelector("#trainingProgressCard"),
  trainingProgressValue: document.querySelector("#trainingProgressValue"),
  trainingProgressFill: document.querySelector("#trainingProgressFill"),
  trainingProgressCopy: document.querySelector("#trainingProgressCopy"),
  trainingCompletionButton: document.querySelector("#trainingCompletionButton"),
  completionView: document.querySelector("#completionView"),
  completionRestartButton: document.querySelector("#completionRestartButton"),
  completionShareButton: document.querySelector("#completionShareButton"),
  completionShareStatus: document.querySelector("#completionShareStatus")
}

const context = nodes.canvas.getContext("2d")

const labOrder = ["token", "memory", "rag", "hallucination", "skills", "training"]

const labConfig = {
  token: {
    viewId: "tokenLab",
    title: "Token 实验室",
    mobileTitle: "Token实验室",
    status: "实验待启动"
  },
  memory: {
    viewId: "memoryLab",
    title: "Memory 实验室",
    mobileTitle: "Memory实验室",
    status: "记忆槽待填充"
  },
  rag: {
    viewId: "ragLab",
    title: "RAG 实验室",
    mobileTitle: "RAG实验室",
    status: "资料库待检索"
  },
  hallucination: {
    viewId: "hallucinationLab",
    title: "幻觉实验室",
    mobileTitle: "幻觉实验室",
    status: "幻觉实验待运行"
  },
  skills: {
    viewId: "skillsLab",
    title: "Agent 实验室",
    mobileTitle: "Agent实验室",
    status: "Agent 实验待运行"
  },
  training: {
    viewId: "trainingLab",
    title: "训练实验室",
    mobileTitle: "训练实验室",
    status: "训练实验待运行"
  }
}

function createTokenList(text) {
  const tokens = []
  let cursor = 0

  while (cursor < text.length) {
    if (/\s/.test(text[cursor])) {
      cursor += 1
      continue
    }

    const matched = dictionary.find((word) => text.slice(cursor).startsWith(word))
    if (matched) {
      tokens.push(matched)
      cursor += matched.length
      continue
    }

    const asciiMatch = text.slice(cursor).match(/^[A-Za-z0-9]+/)
    if (asciiMatch) {
      tokens.push(asciiMatch[0])
      cursor += asciiMatch[0].length
      continue
    }

    tokens.push(text[cursor])
    cursor += 1
  }

  return tokens
}

function predictNext(text) {
  return getTokenScene(text).predictions
}

function getTokenScene(text) {
  if (text.includes("熊猫")) return tokenCases[2]
  if (text.includes("最喜欢吃") && !text.includes("熊猫")) return tokenCases[1]
  if (text.includes("天气") || text.endsWith("真")) return tokenCases[0]
  return {
    label: "自定义",
    text,
    teaching: "自定义输入也会被拆成 Token，再预测下一个片段。",
    guessOptions: ["好", "了", "吗", "呢"],
    predictions: [
      { token: "了", prob: 45, color: "#1f7aec" },
      { token: "吗", prob: 30, color: "#31b889" },
      { token: "呢", prob: 15, color: "#f59e0b" },
      { token: "好", prob: 10, color: "#6b7a90" }
    ]
  }
}

function switchLab(lab) {
  const config = labConfig[lab]
  if (!config) return

  const labIndex = labOrder.indexOf(lab)
  state.isComplete = false
  state.activeLab = lab
  nodes.completionView.hidden = true
  document.body.classList.remove("completion-mode")
  nodes.runState.textContent = config.status
  document.title = `${config.title} - AI LAB`

  nodes.tabs.forEach((tab) => {
    const isActive = tab.dataset.lab === lab
    tab.classList.toggle("active", isActive)
    tab.setAttribute("aria-selected", String(isActive))
  })
  nodes.labViews.forEach((view) => {
    view.classList.toggle("is-active", view.id === config.viewId)
  })
  nodes.mobileLabOptions.forEach((option) => {
    const isActive = option.dataset.lab === lab
    option.classList.toggle("active", isActive)
    option.setAttribute("aria-current", isActive ? "page" : "false")
  })
  nodes.mobileCurrentLab.textContent = `第${labIndex + 1}关 · ${config.mobileTitle}`
  updateMobilePager()
  closeMobileLabDrawer()
}

function updateMobilePager() {
  if (state.isComplete) {
    nodes.previousLabButton.hidden = true
    nodes.mobileLevelProgress.hidden = true
    nodes.nextLabButton.disabled = false
    nodes.nextLabButton.textContent = "重新开始"
    return
  }

  const labIndex = labOrder.indexOf(state.activeLab)
  nodes.previousLabButton.hidden = false
  nodes.mobileLevelProgress.hidden = false
  nodes.mobileLevelProgress.textContent = `${labIndex + 1} / ${labOrder.length}`
  nodes.previousLabButton.disabled = labIndex === 0
  nodes.nextLabButton.textContent = labIndex === labOrder.length - 1 ? "完成实验" : "下一关"
  nodes.nextLabButton.disabled = labIndex === labOrder.length - 1 && !state.trainingLearned
}

function openMobileLabDrawer() {
  nodes.mobileLabDrawer.classList.add("is-open")
  nodes.mobileLabDrawer.setAttribute("aria-hidden", "false")
  nodes.mobileLabMenuButton.setAttribute("aria-expanded", "true")
  document.body.classList.add("mobile-drawer-open")
  nodes.mobileLabOptions[labOrder.indexOf(state.activeLab)]?.focus()
}

function closeMobileLabDrawer() {
  nodes.mobileLabDrawer.classList.remove("is-open")
  nodes.mobileLabDrawer.setAttribute("aria-hidden", "true")
  nodes.mobileLabMenuButton.setAttribute("aria-expanded", "false")
  document.body.classList.remove("mobile-drawer-open")
}

function renderTokens(tokens, sentCount = 0) {
  nodes.tokenTrack.innerHTML = ""

  if (!tokens.length) {
    nodes.tokenTrack.innerHTML = '<div class="empty-hint">点击开始后，这里会出现被切开的片段。</div>'
    return
  }

  tokens.forEach((token, index) => {
    const pill = document.createElement("div")
    pill.className = `token-pill${index < sentCount ? " is-sent" : ""}`
    pill.textContent = token
    nodes.tokenTrack.appendChild(pill)
  })
}

function renderTokenBrainMemory(tokens) {
  nodes.brainMemory.innerHTML = ""
  tokens.forEach((token) => {
    const item = document.createElement("span")
    item.className = "mini-token"
    item.textContent = token
    nodes.brainMemory.appendChild(item)
  })
}

function renderPredictionPreview(tokens) {
  nodes.sentencePreview.innerHTML = ""
  tokens.forEach((token) => {
    const item = document.createElement("span")
    item.className = "preview-token"
    item.textContent = token
    nodes.sentencePreview.appendChild(item)
  })

  const blank = document.createElement("span")
  blank.className = "blank-token"
  blank.textContent = "____"
  nodes.sentencePreview.appendChild(blank)
}

function renderProbabilityList(predictions, animateBars = false) {
  nodes.probList.innerHTML = ""
  predictions.forEach((prediction) => {
    const row = document.createElement("div")
    row.className = "prob-row"

    const head = document.createElement("div")
    head.className = "prob-head"

    const token = document.createElement("span")
    token.className = "prob-token"
    token.textContent = prediction.token

    const value = document.createElement("span")
    value.className = "prob-value"
    value.textContent = `${prediction.prob}%`

    const track = document.createElement("div")
    track.className = "prob-track"

    const fill = document.createElement("div")
    fill.className = "prob-fill"
    fill.style.background = prediction.color

    head.append(token, value)
    track.appendChild(fill)
    row.append(head, track)
    nodes.probList.appendChild(row)

    requestAnimationFrame(() => {
      fill.style.width = animateBars ? `${prediction.prob}%` : "0"
    })
  })
}

function resetGuessStep(scene) {
  state.selectedGuess = ""
  nodes.guessHint.hidden = false
  nodes.guessPanel.hidden = true
  nodes.tokenResult.hidden = true
  nodes.tokenResult.textContent = ""
  nodes.probList.innerHTML = ""
  renderGuessOptions(scene)
}

function showGuessStep(scene) {
  nodes.guessHint.hidden = true
  nodes.guessPanel.hidden = false
  renderGuessOptions(scene)
}

function renderGuessOptions(scene) {
  nodes.guessOptions.innerHTML = ""
  scene.guessOptions.forEach((option) => {
    const button = document.createElement("button")
    button.type = "button"
    button.className = `guess-option${state.selectedGuess === option ? " is-selected" : ""}`
    button.dataset.guess = option

    const dot = document.createElement("span")
    dot.className = "radio-dot"

    const text = document.createElement("span")
    text.textContent = option

    button.append(dot, text)
    button.addEventListener("click", () => chooseTokenGuess(option))
    nodes.guessOptions.appendChild(button)
  })
}

function chooseTokenGuess(guess) {
  const scene = state.activeTokenScene
  const topToken = scene.predictions[0].token
  const resultText = guess === topToken
    ? "你选中了最高概率！这就是 AI 生成文字的核心原理：预测下一个 Token。"
    : `AI 的最高概率选择是“${topToken}”。这就是 AI 生成文字的核心原理：预测下一个 Token。`

  state.selectedGuess = guess
  renderGuessOptions(scene)
  renderProbabilityList(scene.predictions, true)
  nodes.tokenResult.hidden = false
  nodes.tokenResult.innerHTML = `<p>${resultText}</p><small>${scene.teaching}</small>`
}

function setProgress(value) {
  state.progress = value
  nodes.progress.textContent = String(value)
  try {
    localStorage.setItem("ai-lab-token-progress", String(value))
  } catch (error) {
    // Storage may be unavailable inside restricted webviews.
  }
}

function setRunning(nextRunning) {
  state.running = nextRunning
  nodes.start.disabled = nextRunning
  nodes.start.querySelector("span:last-child").textContent = nextRunning ? "实验运行中" : "开始实验"
  nodes.runState.textContent = nextRunning ? "Token 传输中" : "实验待启动"
}

function clearTokenTimers() {
  state.tokenTimers.forEach((timer) => clearTimeout(timer))
  state.tokenTimers = []
}

function pulseBrain() {
  nodes.brainCore.classList.remove("is-pulsing")
  void nodes.brainCore.offsetWidth
  nodes.brainCore.classList.add("is-pulsing")
}

function spawnParticles(amount) {
  for (let index = 0; index < amount; index += 1) {
    state.particles.push({
      x: Math.random() * nodes.canvas.width,
      y: nodes.canvas.height + Math.random() * 80,
      speed: 0.6 + Math.random() * 1.5,
      size: 1 + Math.random() * 2.8,
      alpha: 0.25 + Math.random() * 0.55
    })
  }
}

function resizeCanvas() {
  const rect = nodes.canvas.getBoundingClientRect()
  const ratio = window.devicePixelRatio || 1
  nodes.canvas.width = Math.max(1, Math.floor(rect.width * ratio))
  nodes.canvas.height = Math.max(1, Math.floor(rect.height * ratio))
  context.setTransform(ratio, 0, 0, ratio, 0, 0)
}

function animateParticles() {
  const width = nodes.canvas.clientWidth
  const height = nodes.canvas.clientHeight
  context.clearRect(0, 0, width, height)

  context.strokeStyle = "rgba(131, 243, 211, 0.13)"
  context.lineWidth = 1
  for (let line = 0; line < 7; line += 1) {
    const y = 24 + line * 28
    context.beginPath()
    context.moveTo(0, y)
    context.lineTo(width, y + Math.sin(Date.now() / 500 + line) * 16)
    context.stroke()
  }

  state.particles.forEach((particle) => {
    particle.y -= particle.speed
    if (particle.y < -12) {
      particle.y = height + Math.random() * 40
      particle.x = Math.random() * width
    }

    context.beginPath()
    context.fillStyle = `rgba(131, 243, 211, ${particle.alpha})`
    context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
    context.fill()
  })

  requestAnimationFrame(animateParticles)
}

function startTokenExperiment() {
  if (state.running) return

  const text = nodes.input.value.trim() || "今天天气真"
  nodes.input.value = text
  state.tokens = createTokenList(text)
  const scene = getTokenScene(text)
  state.activeTokenScene = scene

  clearTokenTimers()
  setRunning(true)
  setProgress(8)
  renderTokens(state.tokens, 0)
  renderTokenBrainMemory([])
  renderPredictionPreview(state.tokens)
  resetGuessStep(scene)

  state.tokens.forEach((token, index) => {
    const timer = setTimeout(() => {
      renderTokens(state.tokens, index + 1)
      renderTokenBrainMemory(state.tokens.slice(0, index + 1))
      pulseBrain()
      spawnParticles(8)
      setProgress(Math.min(82, 18 + Math.round(((index + 1) / state.tokens.length) * 56)))
    }, 320 + index * 460)

    state.tokenTimers.push(timer)
  })

  const finishTimer = setTimeout(() => {
    setProgress(100)
    setRunning(false)
    nodes.runState.textContent = "实验完成"
    showGuessStep(scene)
  }, 620 + state.tokens.length * 460)

  state.tokenTimers.push(finishTimer)
}

function refreshTokenPreview() {
  if (state.running) return
  const text = nodes.input.value.trim()
  state.tokens = createTokenList(text)
  const scene = getTokenScene(text)
  state.activeTokenScene = scene
  renderTokens(state.tokens, 0)
  renderTokenBrainMemory([])
  renderPredictionPreview(state.tokens)
  resetGuessStep(scene)
  setProgress(0)
}

function renderMemoryLab() {
  nodes.memoryCount.textContent = String(state.memoryItems.length)
  nodes.slotGrid.innerHTML = ""

  for (let index = 0; index < 3; index += 1) {
    const slot = document.createElement("div")
    const memory = state.memoryItems[index]
    slot.className = `memory-slot${memory ? " is-filled" : ""}`

    const label = document.createElement("span")
    label.className = "slot-label"
    label.textContent = `槽 ${index + 1}`

    const content = document.createElement("strong")
    content.textContent = memory || "空"

    slot.append(label, content)
    nodes.slotGrid.appendChild(slot)
  }

  nodes.evictStrip.textContent = state.evictedItem
    ? `记忆槽满了，最早的信息被挤掉了。被挤出去：${state.evictedItem}`
    : "继续加入第 4 条信息，最早的信息会被挤掉"
  nodes.evictStrip.classList.toggle("is-active", Boolean(state.evictedItem))

  nodes.memoryFeed.innerHTML = ""
  const feedItems = state.memoryItems.length ? state.memoryItems : ["还没有记忆"]
  feedItems.forEach((item) => {
    const bubble = document.createElement("div")
    bubble.className = "feed-bubble"
    bubble.textContent = item
    nodes.memoryFeed.appendChild(bubble)
  })
}

function rememberFact() {
  const fact = nodes.memoryInput.value.trim()
  if (!fact) {
    nodes.runState.textContent = "请先选择一件事"
    nodes.rememberButton.disabled = true
    return
  }

  state.evictedItem = ""
  state.memoryItems.push(fact)

  if (state.memoryItems.length > 3) {
    state.evictedItem = state.memoryItems.shift()
  }

  nodes.memoryInput.value = ""
  nodes.rememberButton.disabled = true
  document.querySelectorAll(".memory-chip").forEach((chip) => {
    chip.classList.remove("is-active")
    chip.setAttribute("aria-pressed", "false")
  })
  nodes.runState.textContent = state.evictedItem ? "旧记忆被挤出" : "新记忆已进入"
  nodes.recallBox.textContent = "AI 现在只能看见槽里的内容。"
  renderMemoryLab()

  try {
    localStorage.setItem("ai-lab-memory-items", JSON.stringify(state.memoryItems))
  } catch (error) {
    // Storage may be unavailable inside restricted webviews.
  }
}

function recallMemory() {
  if (!state.memoryItems.length) {
    nodes.recallBox.textContent = "AI：我现在没有可用记忆。"
    return
  }

  const like = state.memoryItems.find((item) => item.includes("喜欢"))
  const place = state.memoryItems.find((item) => item.includes("住"))
  const birthday = state.memoryItems.find((item) => item.includes("生日"))
  const game = state.memoryItems.find((item) => item.includes("游戏"))
  const fear = state.memoryItems.find((item) => item.includes("怕"))
  const visible = [like, place, birthday, game, fear].filter(Boolean)

  if (!visible.length) {
    nodes.recallBox.textContent = `AI：我只看见这些最近信息：${state.memoryItems.join("、")}。`
    return
  }

  nodes.recallBox.textContent = `AI：我能记起：${visible.join("；")}。`
}

function renderSkillsLab() {
  nodes.skillCount.textContent = String(state.agentPlanSteps.length)
  nodes.skillGrid.innerHTML = ""

  skillOptions.forEach((skill) => {
    const card = document.createElement("button")
    card.type = "button"
    card.className = `tool-card${state.installedSkills.includes(skill.id) ? " is-installed" : ""}`
    card.dataset.skill = skill.id

    const icon = document.createElement("span")
    icon.className = "tool-icon"
    icon.textContent = skill.icon

    const name = document.createElement("span")
    name.className = "tool-name"
    name.textContent = skill.name

    const desc = document.createElement("span")
    desc.className = "tool-desc"
    desc.textContent = skill.desc

    card.append(icon, name, desc)
    card.addEventListener("click", () => chooseAgentTool(skill.id))
    nodes.skillGrid.appendChild(card)
  })

  nodes.questionList.innerHTML = ""
  const task = document.createElement("div")
  task.className = "question-button is-active"
  task.textContent = "任务：帮我规划明天去迪士尼。"
  nodes.questionList.appendChild(task)

  state.agentPlanSteps.forEach((step) => {
    const item = document.createElement("div")
    item.className = "training-reward-item"
    item.textContent = step.result
    nodes.questionList.appendChild(item)
  })
}

function chooseAgentTool(skillId) {
  const nextStep = agentSteps[state.agentPlanSteps.length]
  const skill = skillOptions.find((item) => item.id === skillId)

  if (!nextStep) return

  nodes.toolRoute.classList.remove("is-off")

  if (skillId !== nextStep.toolId) {
    nodes.toolRoute.classList.add("is-off")
    nodes.toolRoute.classList.remove("is-on")
    nodes.toolRoute.textContent = "还不是这一步。Agent 需要先判断：现在最该用什么工具？"
    nodes.aiAnswer.textContent = `你选择了${skill.name}。这一步还用不上它，先按任务顺序继续。`
    nodes.runState.textContent = "工具顺序需要调整"
    return
  }

  state.installedSkills = state.installedSkills.concat(skillId)
  state.agentPlanSteps = state.agentPlanSteps.concat(nextStep)
  const completed = state.agentPlanSteps.length === agentSteps.length

  nodes.toolRoute.classList.toggle("is-on", completed)
  nodes.toolRoute.textContent = state.agentPlanSteps.map((step) => step.route).join(" → ")
  nodes.aiAnswer.textContent = completed
    ? "最终计划：明天有雨，建议带伞；坐地铁约 40 分钟；迪士尼开放时间 9:00-21:00，可以上午出发。"
    : nextStep.result
  nodes.runState.textContent = completed ? "Agent 已完成任务" : "Agent 已调用工具"
  renderSkillsLab()
}

function resetAgent() {
  state.installedSkills = []
  state.agentPlanSteps = []
  nodes.toolRoute.classList.remove("is-on", "is-off")
  nodes.toolRoute.textContent = "任务 → 判断需要什么 → 调用工具 → 整理计划"
  nodes.aiAnswer.textContent = "普通 AI：可以给你一些建议。Agent：会一步步调用工具，把结果组合成计划。"
  nodes.runState.textContent = "Agent 实验待运行"
  renderSkillsLab()
}

function renderRagLab() {
  nodes.ragHitCount.textContent = String(state.ragHitIds.length)
  nodes.ragQuestionList.innerHTML = ""

  ragQuestions.forEach((question) => {
    const button = document.createElement("button")
    button.type = "button"
    button.className = `rag-question-button${state.activeRagQuestionId === question.id ? " is-active" : ""}`
    button.textContent = question.text
    button.addEventListener("click", () => chooseRagQuestion(question.id))
    nodes.ragQuestionList.appendChild(button)
  })

  nodes.ragDocList.innerHTML = ""
  ragDocs.forEach((doc) => {
    const card = document.createElement("div")
    card.className = `rag-doc-card${state.ragHitIds.includes(doc.id) ? " is-hit" : ""}`

    const title = document.createElement("span")
    title.className = "rag-doc-title"
    title.textContent = doc.title

    const text = document.createElement("span")
    text.className = "rag-doc-text"
    text.textContent = doc.text

    card.append(title, text)
    nodes.ragDocList.appendChild(card)
  })

  nodes.ragRoute.classList.toggle("is-found", state.ragHitIds.length > 0)
}

function chooseRagQuestion(questionId) {
  clearRagTimer()
  state.activeRagQuestionId = questionId
  state.ragHitIds = []
  nodes.ragStatus.textContent = "问题变了，资料库没变。AI 需要重新搜索。"
  nodes.ragAnswer.textContent = "AI：我还没有查资料，所以不能直接回答。"
  nodes.ragSearchButton.disabled = false
  nodes.ragSearchButton.querySelector("span:last-child").textContent = "重新搜索资料"
  renderRagLab()
}

function startRagSearch() {
  clearRagTimer()
  const question = ragQuestions.find((item) => item.id === state.activeRagQuestionId) || ragQuestions[0]
  state.ragHitIds = []
  nodes.ragStatus.textContent = "资料库没有变化，AI 正在重新搜索对应资料..."
  nodes.ragAnswer.textContent = "AI：先等等，我正在查资料。"
  nodes.ragSearchButton.disabled = true
  nodes.ragSearchButton.querySelector("span:last-child").textContent = "正在重新搜索"
  renderRagLab()

  state.ragTimer = setTimeout(() => {
    state.ragHitIds = question.docIds
    nodes.ragStatus.textContent = "找到对应资料，AI 开始生成答案。"
    nodes.ragAnswer.textContent = question.answer
    nodes.ragSearchButton.disabled = false
    nodes.ragSearchButton.querySelector("span:last-child").textContent = "重新搜索资料"
    nodes.runState.textContent = "资料已命中"
    renderRagLab()
  }, 650)
}

function clearRagTimer() {
  if (state.ragTimer) {
    clearTimeout(state.ragTimer)
    state.ragTimer = null
  }
}

function renderHallucinationLab() {
  const round = hallucinationRounds[state.hallucinationRoundIndex]
  const isComplete = state.hallucinationPhase === "complete"
  const isGenerating = state.hallucinationPhase === "generating"
  const hasAnswer = state.hallucinationPhase === "answer" || state.hallucinationPhase === "feedback"
  const hasFeedback = state.hallucinationPhase === "feedback"

  nodes.hallucinationRoundBadge.textContent = isComplete ? "✓" : String(state.hallucinationRoundIndex + 1)
  nodes.hallucinationSummary.hidden = !isComplete
  document.querySelector("#hallucinationGame").hidden = isComplete

  nodes.hallucinationRoundTrack.innerHTML = ""
  hallucinationRounds.forEach((item, index) => {
    const step = document.createElement("span")
    step.className = "hallucination-track-step"
    if (isComplete || index < state.hallucinationRoundIndex) step.classList.add("is-complete")
    if (!isComplete && index === state.hallucinationRoundIndex) step.classList.add("is-current")
    step.title = `第${index + 1}轮：${item.title}`
    nodes.hallucinationRoundTrack.appendChild(step)
  })

  if (isComplete) return

  nodes.hallucinationRoundNumber.textContent = `第${state.hallucinationRoundIndex + 1}轮`
  nodes.hallucinationRoundTitle.textContent = round.title
  nodes.hallucinationRoundTag.textContent = round.tag
  nodes.hallucinationQuestion.textContent = round.question
  nodes.hallucinationAiState.textContent = isGenerating ? "🤖 AI正在生成..." : hasAnswer ? "🤖 AI自信回答" : "等待生成"
  nodes.hallucinationGenerating.hidden = !isGenerating
  nodes.hallucinationAnswerContent.hidden = isGenerating
  nodes.hallucinationAiCard.classList.toggle("is-confident", hasAnswer)
  nodes.hallucinationRunButton.hidden = state.hallucinationPhase !== "ready"
  nodes.hallucinationRunButton.disabled = isGenerating
  nodes.hallucinationJudgmentActions.hidden = state.hallucinationPhase !== "answer"
  nodes.hallucinationFeedback.hidden = !hasFeedback
  nodes.hallucinationNextButton.hidden = !hasFeedback

  nodes.hallucinationAnswerContent.textContent = hasAnswer
    ? round.answer
    : "点击下方按钮，看看 AI 会多自信地回答。"

  if (hasFeedback) {
    nodes.hallucinationFeedback.className = `hallucination-feedback ${state.hallucinationSelectionCorrect ? "is-correct" : "is-wrong"}`
    nodes.hallucinationFeedback.innerHTML = `
      <strong>${state.hallucinationSelectionCorrect ? "判断正确" : "判断错误"}</strong>
      ${round.explanation}
      <span class="hallucination-reminder">${round.reminder}</span>
    `
    nodes.hallucinationNextButton.textContent =
      state.hallucinationRoundIndex === hallucinationRounds.length - 1 ? "查看最终总结" : "进入下一轮"
  }
}

function startHallucinationAnswer() {
  clearHallucinationTimer()
  if (state.hallucinationPhase !== "ready") return

  state.hallucinationPhase = "generating"
  state.hallucinationSelection = null
  state.hallucinationSelectionCorrect = false
  nodes.runState.textContent = "AI 正在自信生成"
  renderHallucinationLab()

  state.hallucinationTimer = setTimeout(() => {
    state.hallucinationPhase = "answer"
    state.hallucinationTimer = null
    nodes.runState.textContent = "请判断 AI 的回答"
    renderHallucinationLab()
  }, 700)
}

function judgeHallucinationAnswer(judgment) {
  const round = hallucinationRounds[state.hallucinationRoundIndex]
  if (state.hallucinationPhase !== "answer" || round.type !== "judgment") return

  state.hallucinationSelection = judgment
  state.hallucinationSelectionCorrect = judgment === "false"
  state.hallucinationPhase = "feedback"
  nodes.runState.textContent = state.hallucinationSelectionCorrect ? "你识破了 AI 幻觉" : "这个答案其实是错的"
  renderHallucinationLab()
}

function advanceHallucinationRound() {
  if (state.hallucinationPhase !== "feedback") return

  if (state.hallucinationRoundIndex === hallucinationRounds.length - 1) {
    state.hallucinationPhase = "complete"
    nodes.runState.textContent = "三轮幻觉挑战完成"
  } else {
    state.hallucinationRoundIndex += 1
    state.hallucinationPhase = "ready"
    state.hallucinationSelection = null
    state.hallucinationSelectionCorrect = false
    nodes.runState.textContent = `进入第${state.hallucinationRoundIndex + 1}轮`
  }
  renderHallucinationLab()
}

function resetHallucinationLab() {
  clearHallucinationTimer()
  state.hallucinationRoundIndex = 0
  state.hallucinationPhase = "ready"
  state.hallucinationSelection = null
  state.hallucinationSelectionCorrect = false
  nodes.runState.textContent = "幻觉实验待运行"
  renderHallucinationLab()
}

function clearHallucinationTimer() {
  if (state.hallucinationTimer) {
    clearTimeout(state.hallucinationTimer)
    state.hallucinationTimer = null
  }
}

function renderTrainingLab() {
  const currentReply = state.trainingReplies[state.trainingCurrentReplyIndex]
  nodes.trainingProgressBadge.textContent = `${state.trainingProgress}%`
  nodes.trainingMessage.textContent = state.trainingMessage
  nodes.trainingMessage.classList.toggle("is-learned", state.trainingLearned)
  nodes.trainingReplyCard.classList.toggle("is-learned", state.trainingLearned)
  nodes.trainingReplyText.textContent = currentReply.text
  nodes.trainingProgressValue.textContent = `${state.trainingProgress}%`
  nodes.trainingProgressFill.style.width = `${state.trainingProgress}%`
  nodes.trainingProgressCard.classList.toggle("is-learned", state.trainingLearned)
  nodes.trainingProgressCopy.textContent = state.trainingLearned
    ? "AI更会回答了"
    : "最佳回复概率达到 80% 以上时，训练完成"

  nodes.trainingProbabilityList.innerHTML = ""
  state.trainingReplies.forEach((reply) => {
    const item = document.createElement("div")
    item.className = `training-probability-item${reply.best ? " is-best" : ""}`

    const head = document.createElement("div")
    head.className = "training-probability-head"

    const text = document.createElement("span")
    text.textContent = reply.text

    const value = document.createElement("strong")
    value.textContent = `${reply.probability}%`

    const track = document.createElement("div")
    track.className = "training-bar-track"

    const fill = document.createElement("div")
    fill.className = `training-bar-fill${reply.best ? " is-best" : ""}`
    fill.style.width = `${reply.probability}%`

    head.appendChild(text)
    head.appendChild(value)
    track.appendChild(fill)
    item.appendChild(head)
    item.appendChild(track)
    nodes.trainingProbabilityList.appendChild(item)
  })

  nodes.trainingCompletionButton.disabled = !state.trainingLearned
  nodes.trainingCompletionButton.textContent = state.trainingLearned
    ? "完成实验"
    : "训练完成后解锁总结"
  updateMobilePager()
}

function applyTrainingFeedback(isGood) {
  const currentIndex = state.trainingCurrentReplyIndex
  if (isGood) rewardTrainingReply(currentIndex)
  else penalizeTrainingReply(currentIndex)

  state.trainingProgress = getTrainingProgress()
  state.trainingLearned = state.trainingReplies[bestTrainingReplyIndex].probability >= 80
  state.trainingMessage = isGood
    ? "奖励 +100：这类回复下次更容易出现。"
    : "惩罚 -10：这类回复概率下降，更合适的回复概率上升。"

  showTrainingFeedback(isGood ? "+100" : "-10", isGood ? "reward" : "penalty")
  state.trainingCurrentReplyIndex = state.trainingLearned ? bestTrainingReplyIndex : weightedTrainingPick()
  nodes.runState.textContent = state.trainingLearned ? "AI更会回答了" : "训练反馈已生效"
  renderTrainingLab()
}

function resetTraining() {
  state.trainingReplies = initialTrainingReplies.map((reply) => ({ ...reply }))
  state.trainingCurrentReplyIndex = 0
  state.trainingProgress = 0
  state.trainingMessage = "AI会根据当前概率选择一个回复。你可以点按钮，也可以左右滑动回复卡片。"
  state.trainingLearned = false
  nodes.trainingFeedback.hidden = true
  nodes.runState.textContent = "训练实验待运行"
  renderTrainingLab()
}

function showCompletionPage() {
  if (!state.trainingLearned) {
    nodes.runState.textContent = "请先完成训练目标"
    return
  }

  state.isComplete = true
  clearTokenTimers()
  clearRagTimer()
  clearHallucinationTimer()
  setRunning(false)
  nodes.labViews.forEach((view) => view.classList.remove("is-active"))
  nodes.completionView.hidden = false
  nodes.completionShareStatus.hidden = true
  document.body.classList.add("completion-mode")
  document.title = "完成 AI 大脑实验室 - AI LAB"
  closeMobileLabDrawer()
  updateMobilePager()
  window.scrollTo({ top: 0, behavior: "smooth" })
}

function restartExperience() {
  clearTokenTimers()
  clearRagTimer()
  clearHallucinationTimer()
  window.clearTimeout(state.trainingFeedbackTimer)
  state.isComplete = false
  state.tokens = []
  state.selectedGuess = ""
  state.activeTokenScene = tokenCases[0]
  state.running = false
  state.memoryItems = []
  state.evictedItem = ""
  nodes.input.value = tokenCases[0].text
  nodes.memoryInput.value = ""
  nodes.rememberButton.disabled = true
  nodes.recallBox.textContent = "先放入几条信息，再让 AI 回忆。"
  nodes.completionShareStatus.hidden = true

  document.querySelectorAll(".memory-chip").forEach((chip) => {
    chip.classList.remove("is-active")
    chip.setAttribute("aria-pressed", "false")
  })

  try {
    localStorage.removeItem("ai-lab-token-progress")
    localStorage.removeItem("ai-lab-memory-items")
  } catch (error) {
    // Storage can be unavailable in private browsing or local file previews.
  }

  setProgress(0)
  refreshTokenPreview()
  renderMemoryLab()
  resetAgent()
  chooseRagQuestion(ragQuestions[0].id)
  resetHallucinationLab()
  resetTraining()
  switchLab("token")
  window.scrollTo({ top: 0, behavior: "smooth" })
}

async function shareCompletion() {
  const currentUrl = window.location.href

  try {
    if (!navigator.clipboard?.writeText) throw new Error("Clipboard API unavailable")
    await navigator.clipboard.writeText(currentUrl)
    nodes.completionShareStatus.textContent = "链接已复制，可以分享给朋友。"
  } catch (error) {
    nodes.completionShareStatus.textContent = "当前浏览器不支持自动复制，请手动复制地址栏中的链接。"
  }

  nodes.completionShareStatus.hidden = false
}

function rewardTrainingReply(index) {
  const amount = index === bestTrainingReplyIndex ? 15 : 6
  state.trainingReplies[index].probability += amount
  takeTrainingProbabilityFromOthers(index, amount)
  normalizeTrainingReplies()
}

function penalizeTrainingReply(index) {
  const amount = index === bestTrainingReplyIndex ? 5 : 15
  const reply = state.trainingReplies[index]
  const actualDrop = Math.min(amount, reply.probability - 2)
  reply.probability -= actualDrop

  const targetIndex = index === bestTrainingReplyIndex ? 1 : bestTrainingReplyIndex
  state.trainingReplies[targetIndex].probability += actualDrop
  normalizeTrainingReplies()
}

function takeTrainingProbabilityFromOthers(keepIndex, amount) {
  let remaining = amount
  state.trainingReplies.forEach((reply, index) => {
    if (index === keepIndex || remaining <= 0) return
    const drop = Math.min(Math.ceil(amount / 3), reply.probability - 2, remaining)
    reply.probability -= drop
    remaining -= drop
  })

  if (remaining > 0) {
    const targetIndex = keepIndex === bestTrainingReplyIndex ? 1 : bestTrainingReplyIndex
    state.trainingReplies[targetIndex].probability = Math.max(
      2,
      state.trainingReplies[targetIndex].probability - remaining
    )
  }
}

function normalizeTrainingReplies() {
  state.trainingReplies.forEach((reply) => {
    reply.probability = Math.max(2, Math.round(reply.probability))
  })

  let total = state.trainingReplies.reduce((sum, reply) => sum + reply.probability, 0)
  while (total !== 100) {
    const diff = 100 - total
    const target = diff > 0
      ? state.trainingReplies[bestTrainingReplyIndex]
      : state.trainingReplies
        .filter((reply) => reply.probability > 2)
        .sort((a, b) => b.probability - a.probability)[0]

    if (!target) break
    target.probability += diff > 0 ? 1 : -1
    total = state.trainingReplies.reduce((sum, reply) => sum + reply.probability, 0)
  }
}

function weightedTrainingPick() {
  const randomValue = Math.random() * 100
  let cursor = 0

  for (let index = 0; index < state.trainingReplies.length; index += 1) {
    cursor += state.trainingReplies[index].probability
    if (randomValue <= cursor) return index
  }

  return state.trainingReplies.length - 1
}

function getTrainingProgress() {
  const bestProbability = state.trainingReplies[bestTrainingReplyIndex].probability
  return Math.min(100, Math.max(0, Math.round(((bestProbability - 20) / 60) * 100)))
}

function showTrainingFeedback(text, type) {
  window.clearTimeout(state.trainingFeedbackTimer)
  nodes.trainingFeedback.textContent = text
  nodes.trainingFeedback.className = `training-feedback is-${type}`
  nodes.trainingFeedback.hidden = false
  state.trainingFeedbackTimer = window.setTimeout(() => {
    nodes.trainingFeedback.hidden = true
  }, 780)
}

function boot() {
  try {
    const savedProgress = Number(localStorage.getItem("ai-lab-token-progress") || 0)
    if (savedProgress) setProgress(savedProgress)
    const savedMemory = JSON.parse(localStorage.getItem("ai-lab-memory-items") || "[]")
    if (Array.isArray(savedMemory)) state.memoryItems = savedMemory.slice(-3)
  } catch (error) {
    setProgress(0)
  }

  resizeCanvas()
  spawnParticles(34)
  animateParticles()
  refreshTokenPreview()
  renderMemoryLab()
  renderSkillsLab()
  renderRagLab()
  renderHallucinationLab()
  renderTrainingLab()

  nodes.start.addEventListener("click", startTokenExperiment)
  nodes.input.addEventListener("input", refreshTokenPreview)
  nodes.rememberButton.addEventListener("click", rememberFact)
  nodes.recallButton.addEventListener("click", recallMemory)
  nodes.agentResetButton.addEventListener("click", resetAgent)
  nodes.ragSearchButton.addEventListener("click", startRagSearch)
  nodes.hallucinationRunButton.addEventListener("click", startHallucinationAnswer)
  nodes.hallucinationJudgmentButtons.forEach((button) => {
    button.addEventListener("click", () => judgeHallucinationAnswer(button.dataset.judgment))
  })
  nodes.hallucinationNextButton.addEventListener("click", advanceHallucinationRound)
  nodes.hallucinationResetButton.addEventListener("click", resetHallucinationLab)
  nodes.trainingBadButton.addEventListener("click", () => applyTrainingFeedback(false))
  nodes.trainingGoodButton.addEventListener("click", () => applyTrainingFeedback(true))
  nodes.trainingResetButton.addEventListener("click", resetTraining)
  nodes.trainingCompletionButton.addEventListener("click", showCompletionPage)
  nodes.completionRestartButton.addEventListener("click", restartExperience)
  nodes.completionShareButton.addEventListener("click", shareCompletion)
  nodes.trainingReplyCard.addEventListener("touchstart", (event) => {
    state.trainingTouchStartX = event.changedTouches[0].clientX
  }, { passive: true })
  nodes.trainingReplyCard.addEventListener("touchend", (event) => {
    const distance = event.changedTouches[0].clientX - state.trainingTouchStartX
    if (distance > 54) applyTrainingFeedback(true)
    if (distance < -54) applyTrainingFeedback(false)
  }, { passive: true })
  window.addEventListener("resize", resizeCanvas)

  nodes.tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const lab = tab.dataset.lab
      switchLab(lab)
    })
  })

  nodes.mobileLabMenuButton.addEventListener("click", openMobileLabDrawer)
  nodes.mobileDrawerBackdrop.addEventListener("click", closeMobileLabDrawer)
  nodes.mobileDrawerClose.addEventListener("click", closeMobileLabDrawer)
  nodes.mobileLabOptions.forEach((option) => {
    option.addEventListener("click", () => switchLab(option.dataset.lab))
  })
  nodes.previousLabButton.addEventListener("click", () => {
    const currentIndex = labOrder.indexOf(state.activeLab)
    if (currentIndex > 0) switchLab(labOrder[currentIndex - 1])
  })
  nodes.nextLabButton.addEventListener("click", () => {
    if (state.isComplete) {
      restartExperience()
      return
    }

    const currentIndex = labOrder.indexOf(state.activeLab)
    if (currentIndex < labOrder.length - 1) {
      switchLab(labOrder[currentIndex + 1])
      return
    }
    showCompletionPage()
  })
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nodes.mobileLabDrawer.classList.contains("is-open")) {
      closeMobileLabDrawer()
      nodes.mobileLabMenuButton.focus()
    }
  })

  let navMouseDown = false
  let navDragStartX = 0
  let navDragStartScrollLeft = 0
  let navDidDrag = false
  let suppressNextNavClick = false

  const stopNavDrag = () => {
    if (!navMouseDown) return

    navMouseDown = false
    suppressNextNavClick = navDidDrag
    nodes.navScroll.classList.remove("dragging")

    window.setTimeout(() => {
      suppressNextNavClick = false
    }, 0)
  }

  nodes.navScroll.addEventListener("mousedown", (event) => {
    if (event.button !== 0) return

    navMouseDown = true
    navDragStartX = event.clientX
    navDragStartScrollLeft = nodes.navScroll.scrollLeft
    navDidDrag = false
    suppressNextNavClick = false
    nodes.navScroll.classList.add("dragging")
  })

  window.addEventListener("mousemove", (event) => {
    if (!navMouseDown) return

    const distance = event.clientX - navDragStartX
    if (Math.abs(distance) > 5) navDidDrag = true
    if (!navDidDrag) return

    event.preventDefault()
    nodes.navScroll.scrollLeft = navDragStartScrollLeft - distance
  })

  window.addEventListener("mouseup", stopNavDrag)
  nodes.navScroll.addEventListener("mouseleave", stopNavDrag)

  nodes.navScroll.addEventListener("click", (event) => {
    if (!suppressNextNavClick) return

    suppressNextNavClick = false
    event.preventDefault()
    event.stopPropagation()
  }, true)

  nodes.navScroll.addEventListener("wheel", (event) => {
    if (nodes.navScroll.scrollWidth <= nodes.navScroll.clientWidth) return

    const delta = event.deltaX || event.deltaY
    if (!delta) return

    event.preventDefault()
    nodes.navScroll.scrollLeft += delta
  }, { passive: false })

  document.querySelectorAll(".chip[data-text]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".chip[data-text]").forEach((chip) => chip.classList.remove("is-active"))
      button.classList.add("is-active")
      nodes.input.value = button.dataset.text
      refreshTokenPreview()
    })
  })

  document.querySelectorAll(".memory-chip").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".memory-chip").forEach((chip) => {
        const isSelected = chip === button
        chip.classList.toggle("is-active", isSelected)
        chip.setAttribute("aria-pressed", String(isSelected))
      })
      nodes.memoryInput.value = button.dataset.memory
      nodes.rememberButton.disabled = false
      nodes.runState.textContent = "已选择一件事"
    })
  })

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) clearTokenTimers()
    if (document.hidden) clearRagTimer()
    if (document.hidden) clearHallucinationTimer()
    if (document.hidden) setRunning(false)
  })

  switchLab(state.activeLab)
}

boot()
