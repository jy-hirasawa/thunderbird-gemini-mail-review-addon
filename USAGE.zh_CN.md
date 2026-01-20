# 使用指南

[English](USAGE.md) | [日本語](USAGE.ja.md) | [Deutsch](USAGE.de.md) | [Français](USAGE.fr.md) | 简体中文

## 快速入门

1. **安装附加组件**
   - 在 Thunderbird 中安装该附加组件（有关安装说明，请参阅 README.md）

2. **配置您的 API 密钥和端点**
   - 转到**工具** → **附加组件和主题**
   - 找到 **Gemini Mail Review** 并点击**首选项**
   - 输入您的 Gemini API 密钥
   - （可选）自定义 API 端点 URL 以使用不同的 Gemini 模型
     - 默认：`https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent`
     - 您可以更改此设置以使用其他模型，如 `gemini-pro`、`gemini-1.5-pro` 等
   - （可选）添加自定义提示模板以自定义 Gemini 分析您的电子邮件的方式
     - 您最多可以保存 3 个带有名称的自定义提示模板
     - 每个模板可以有一个描述性名称和自定义说明
     - **多语言支持**：用任何语言编写您的自定义提示，Gemini 将用同一语言回复
       - 英语提示 → 英语分析结果
       - 日语提示（日本語）→ 日语分析结果（日本語）
       - 西班牙语提示（Español）→ 西班牙语分析结果（Español）
       - 这适用于 Gemini 支持的任何语言
     - 商务电子邮件检查示例（英语）："Review this email for business communication. Check if the language is polite, appropriate for clients, and sufficiently formal. Flag any inappropriate, unnatural, or misleading expressions."
     - 商务电子邮件检查示例（日语）："以下のメール本文が、取引先・顧客など会社宛てのメールとして、敬語や言い回しが適切か、失礼・不自然・誤解を招く表現がないか、ビジネスメールとして十分にフォーマルかを確認してください。問題点があれば、理由とあわせて修正案を提示してください。"
   - 点击**测试连接**以验证您的配置
   - 点击**保存设置**

   ![Settings Page](doc/images/settings-page.png)
   *显示 API 密钥配置、自定义提示和其他选项的设置页面*

3. **撰写电子邮件**
   - 创建新电子邮件或回复现有邮件
   - 像往常一样编写您的电子邮件

4. **发送前检查**
   - 在点击发送之前，点击撰写工具栏中的 **Gemini Mail Review** 图标
   
   ![Compose Window with Icon](doc/images/compose-window-icon.png)
   *Thunderbird 撰写窗口工具栏中的 Gemini Mail Review 图标*
   
   - 弹出窗口打开并显示模板选择：
     - 从下拉菜单中选择自定义提示模板（如果您配置了任何模板）
     - 根据需要查看和编辑自定义提示
     - 点击**分析电子邮件**开始分析
   
   ![Template Selection](doc/images/popup-template-selection.png)
   *显示模板选择和自定义提示编辑器的弹出窗口*
   
   - 等待 AI 分析（通常需要 2-5 秒）
   
   ![Analyzing](doc/images/popup-analyzing.png)
   *分析进行中*
   
   - 查看反馈
   
   ![Analysis Results](doc/images/popup-results.png)
   *显示 AI 反馈和建议*

5. **根据反馈采取行动**
   - **编辑电子邮件**：关闭弹出窗口并根据建议进行更改
   - **仍然发送**：关闭弹出窗口并继续发送（您仍需要点击发送按钮）

## 了解缓存结果

当您多次分析同一封电子邮件时，附加组件使用智能缓存来节省 API 调用并提供即时反馈。

### 缓存响应
当您查看已经分析过的电子邮件时，您将看到缓存响应指示器：

![Cached Result](doc/images/popup-cached-result.png)
*缓存的分析结果即时显示，带有 "📦 Showing cached response" 指示器*

### 内容已更改警告
如果您在分析后编辑电子邮件，下次查看将显示之前的分析并带有警告：

![Content Changed](doc/images/popup-content-changed.png)
*显示之前的分析，带有 "⚠️ Email content has changed" 警告和重新请求分析的选项*

这使您能够：
- 快速查看之前的反馈
- 决定是否需要对更改进行新的分析
- 如果您想要对更新内容进行新的分析，点击 "Request Again from Gemini"

## 示例用例

### 检查语法错误
**场景**：您不确定您的电子邮件是否有任何拼写错误或语法错误。

**操作**：点击 Gemini Mail Review 按钮。AI 将识别拼写和语法错误并提出纠正建议。

### 验证专业语气
**场景**：您正在发送一封重要的商务电子邮件，并希望确保它听起来专业。

**操作**：使用查看功能获取有关语气和专业性的反馈。AI 会告诉您语气是否合适或是否需要调整。

### 捕获缺失的附件
**场景**：您在电子邮件中提到了"请参阅附件"，但忘记附加文件。

**操作**：AI 可以检测您何时提到附件，并在没有附加任何附件时提醒您（注意：这需要电子邮件内容提到附件）。

### 清晰度检查
**场景**：您写了一封复杂的电子邮件，想确保它清晰明了。

**操作**：查看将识别不清楚的部分并提出改进清晰度和简洁性的方法。

### 多语言电子邮件审查
**场景**：您用英语以外的语言撰写电子邮件，并希望用您的母语进行分析。

**操作**：用您喜欢的语言创建自定义提示模板。AI 将分析您的电子邮件并用同一语言提供反馈。例如：
- 用日语编写您的自定义提示 → 获得日语分析结果
- 用西班牙语编写您的自定义提示 → 获得西班牙语分析结果
- 用法语编写您的自定义提示 → 获得法语分析结果

**按语言分类的自定义提示示例**：

**日语（日本語）**：
```
このメールを分析して、以下の点を確認してください：
- 文法とスペルミス
- 敬語の適切な使用
- ビジネスメールとしての適切さ
- 言い回しの自然さ
問題点があれば、理由と修正案を日本語で提示してください。
```

**西班牙语（Español）**：
```
Analiza este correo electrónico y verifica:
- Gramática y ortografía
- Tono profesional
- Claridad del mensaje
- Posibles problemas
Proporciona comentarios y sugerencias en español.
```

**法语（Français）**：
```
Analysez cet e-mail et vérifiez:
- La grammaire et l'orthographe
- Le ton professionnel
- La clarté du message
- Les problèmes potentiels
Fournissez des commentaires et des suggestions en français.
```

## 了解审查结果

AI 分析通常包括：

- **✓ 积极反馈**：您的电子邮件中运行良好的内容
- **⚠️ 警告**：可能令人担忧但不一定是错误的事情
- **❌ 问题**：发送前应解决的问题
- **💡 建议**：具体的改进建议

## 获得最佳结果的技巧

1. **先写后查**：在运行审查之前完成您的电子邮件，以获得更全面的反馈
2. **使用描述性主题**：包含主题行以进行更好的上下文分析
3. **定期审查**：养成在发送重要电子邮件之前进行审查的习惯
4. **不要过度依赖**：将 AI 用作有用的助手，而不是替代您的判断
5. **隐私意识**：请记住，您的电子邮件会发送到 Google 的 API 进行分析

## 故障排除

### 无分析结果
- 检查您的互联网连接
- 验证您的 API 密钥配置是否正确
- 确保您没有超过 API 速率限制

### 响应缓慢
- 大型电子邮件需要更长的分析时间
- API 响应时间可能因服务器负载而异
- 考虑分别审查非常长的电子邮件的各个部分

### 不准确的建议
- AI 很有帮助，但并不完美
- 在评估建议时使用您的判断
- 上下文很重要 - 您比 AI 更了解您的收件人

### API 密钥问题
- 确保您的 API 密钥有效且处于活动状态
- 检查您是否没有超过配额
- 如果旧密钥不起作用，请生成新密钥

## 隐私和安全

- **发送的内容**：主题、收件人和电子邮件正文
- **不发送的内容**：附件、您的 API 密钥（除了发送给 Google）
- **数据存储**：您的 API 密钥本地存储在 Thunderbird 中
- **数据传输**：通过 HTTPS 安全发送到 Google 的 Gemini API
- **保留**：有关他们如何处理 API 数据，请参阅 Google 的隐私政策

## API 使用和限制

Google Gemini API 的免费层包括：
- 每分钟 60 个请求
- 足以满足典型的电子邮件使用

如果超过限制：
- 您将看到错误消息
- 等待一分钟后再次尝试
- 如有需要，请考虑升级您的 API 计划

## 最佳实践

1. **飞行前检查**：在发送重要电子邮件之前始终进行审查
2. **多次审查**：如果您在审查后进行了重大更改，请再次审查
3. **从反馈中学习**：注意 AI 在您的写作中识别的常见问题
4. **与校对相结合**：将 AI 审查与您自己的校对相结合使用
5. **上下文意识**：如有需要，在您的电子邮件中添加上下文以获得更好的分析

## 功能请求和反馈

如果您有建议或发现问题，请在项目的 GitHub 存储库中报告。
