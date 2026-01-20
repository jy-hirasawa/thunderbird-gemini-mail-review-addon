# 开发说明

[English](../en/DEVELOPMENT.md) | [日本語](../ja/DEVELOPMENT.md) | [Deutsch](../de/DEVELOPMENT.md) | [Français](../fr/DEVELOPMENT.md) | 简体中文

## 项目概述
这是一个 Thunderbird 插件，集成了 Google 的 Gemini AI 来在发送前审查电子邮件。

## 架构

### 组件交互流程
1. 用户在 Thunderbird 中撰写电子邮件
2. 用户点击撰写工具栏中的 "Gemini Mail Review" 按钮
3. `popup.js` 打开并立即开始分析：
   - 从本地存储中检索 API 密钥和端点
   - 获取撰写详情（主题、收件人、正文）
   - 清理内容以防止提示注入
   - 通过配置的端点使用分析提示调用 Gemini API
   - 在弹出窗口 UI 中显示结果
4. 用户查看反馈并决定编辑或发送

### 文件结构
```
├── manifest.json          # 扩展清单
├── background.js          # 后台脚本（最小化）
├── popup.html/css/js      # 主审查界面
├── options.html/css/js    # 设置页面
├── icons/                 # 扩展图标
├── package.json           # 项目元数据
├── README.md              # 用户文档
├── USAGE.md               # 使用指南
└── DEVELOPMENT.md         # 本文件
```

## 安全考虑

### 已实施的安全措施

1. **API 密钥保护**
   - 存储在 browser.storage.local 中（其他扩展无法访问）
   - 通过 HTTP 头发送，而非 URL 参数
   - 除了发送到 Google API 外从不记录或传输
   - 使用前进行格式验证

2. **内容清理**
   - 最大内容长度：10,000 字符
   - 删除潜在的注入模式：
     - 指令标签：`[INST]`、`[/INST]`
     - 系统标签：`<<SYS>>`、`<</SYS>>`
     - 行首的 Markdown 标题
     - 代码块分隔符
     - 水平线
   - 防止提示注入攻击

3. **类型安全**
   - 处理各种收件人格式（数组/字符串）
   - 全程采用防御性编程
   - 全面的错误处理

### 安全扫描结果
- CodeQL：0 个警告
- 无 XSS 漏洞
- 无注入漏洞
- 无凭证泄露

## API 集成

### 可配置的 Gemini API 端点

该插件支持可配置的 API 端点，允许用户选择不同的 Gemini 模型：

**默认端点：**
```
https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent
```

**替代模型：**
- `gemini-pro`：`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent`
- `gemini-1.5-pro`：`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent`
- `gemini-2.0-flash`：`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent`

用户可以在选项页面配置端点。如果未设置自定义端点，将自动使用默认端点（gemini-2.5-flash）。

### 自定义提示模板

该插件支持最多 3 个用户可配置的自定义提示模板：

**功能：**
- 每个模板都有名称和内容
- 模板名称显示在弹出窗口 UI 中以便轻松选择
- 用户可以在分析电子邮件前选择和编辑模板
- 模板存储在 browser.storage.local 中
- 提示会添加到分析请求之前

**存储格式：**
```javascript
{
  customPromptTemplates: {
    template1: { name: 'Business Email', content: 'Review this email...' },
    template2: { name: 'Casual Email', content: 'Check if...' },
    template3: { name: '', content: '' }
  }
}
```

**UI 流程：**
1. 用户打开弹出窗口 → 模板选择器出现
2. 用户从下拉列表中选择模板（显示模板名称）
3. 模板内容加载到可编辑的文本区域
4. 用户可以在分析前修改提示
5. 修改后的提示用于该特定审查
6. 设置中的原始模板保持不变

### 请求格式
```javascript
{
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-goog-api-key': apiKey
  },
  body: JSON.stringify({
    contents: [{
      parts: [{ text: prompt }]
    }]
  })
}
```

### 响应格式
```javascript
{
  candidates: [{
    content: {
      parts: [{ text: "Analysis result..." }]
    }
  }]
}
```

## 测试策略

### 手动测试检查清单
- [ ] 在 Thunderbird 中安装插件
- [ ] 在设置中配置 API 密钥
- [ ] 测试连接验证
- [ ] 撰写电子邮件并触发审查
- [ ] 验证分析正确显示
- [ ] 测试错误处理（无效 API 密钥）
- [ ] 使用各种电子邮件格式测试
- [ ] 使用长电子邮件测试（>10k 字符）
- [ ] 验证按钮工作（编辑电子邮件、仍然发送）

### 已处理的边缘情况
- 空主题/正文/收件人
- 非常长的电子邮件（在 10k 字符处截断）
- 不同格式的收件人（数组 vs 字符串）
- 无效 API 密钥
- 网络错误
- API 速率限制
- 格式错误的 API 响应

## 未来增强功能（超出范围）

1. **附件分析**：根据电子邮件内容检测缺失的附件
2. **多个 AI 模型**：支持其他 AI 提供商（OpenAI、Claude 等）
3. **批量审查**：一次审查多封草稿电子邮件
4. **历史记录**：跟踪审查历史和常见问题
5. **应用建议**：一键自动应用 AI 建议
6. **离线模式**：缓存常见检查以供离线使用
7. **语言支持**：多语言电子邮件分析
8. **更多模板槽位**：支持超过 3 个自定义提示模板

## 已知限制

1. **API 依赖**：需要活跃的互联网连接和有效的 API 密钥
2. **无附件分析**：无法检查实际附件存在
3. **速率限制**：受 Google API 速率限制（免费层级 60 请求/分钟）
4. **仅纯文本**：分析纯文本正文，不包括 HTML 格式
5. **非实时**：按需进行分析，而非边输入边分析
6. **专注于英语**：AI 对英语电子邮件效果最好

## 开发环境

### 要求
- Thunderbird 102.0 或更高版本
- Node.js（用于语法检查）
- Python 3（用于图标生成，Pillow）
- 用于 API 测试的互联网连接

### 开发命令
```bash
# 验证 JavaScript 语法
node --check *.js

# 验证 JSON
python3 -m json.tool manifest.json

# 打包扩展（需要 web-ext）
npm run package

# 在 Thunderbird 中运行（需要 web-ext）
npm run start
```

### 加载进行开发
1. 打开 Thunderbird
2. 转到工具 → 附加组件和主题
3. 点击齿轮图标 → 调试附加组件
4. 点击"加载临时附加组件"
5. 从此目录选择 manifest.json

## 维护说明

### 版本更新
- 同时更新 `manifest.json` 和 `package.json` 中的版本
- 如果功能有变化，更新 README
- 发布前运行安全扫描

### API 更改
如果 Google 更改 Gemini API：
- 更新 `popup.js` 和 `options.js` 中的端点
- 根据需要更新请求/响应格式
- 更新新错误代码的错误处理
- 发布前彻底测试

### 浏览器兼容性
- Thunderbird 102+：完全支持
- 旧版本：可能缺少撰写 API 功能
- 发布前在多个 Thunderbird 版本上测试

## 贡献指南

1. 保持最小的代码更改
2. 遵循现有代码风格
3. 仅为复杂逻辑添加注释
4. 提交前运行语法验证
5. 运行 CodeQL 安全扫描
6. 如果行为改变，更新文档
7. 在 Thunderbird 中手动测试

## 许可证
MIT 许可证 - 请参阅 LICENSE 文件
