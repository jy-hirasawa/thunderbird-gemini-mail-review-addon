# Security Policy

## Data Storage and Privacy

This add-on stores the following data locally in Thunderbird's browser.storage.local:

### Stored Data

1. **API Key** (`geminiApiKey`)
   - Your Google Gemini API key
   - Stored in plain text (browser.storage.local does not provide encryption)
   - Never transmitted to any server except Google's Gemini API

2. **API Endpoint** (`geminiApiEndpoint`)
   - The Gemini API endpoint URL
   - Validated to ensure HTTPS protocol and Google domains only
   - Protected against SSRF attacks

3. **Custom Prompt Templates** (`customPromptTemplates`)
   - Up to 3 custom prompt templates with names and content
   - Sanitized to prevent prompt injection attacks
   - Limited to 100 characters for names and 5000 characters for content

4. **Email Cache** (`geminiCache`)
   - Cached analysis results including:
     - Email subject (sanitized)
     - Email recipients (sanitized)
     - Email body content (sanitized, max 10,000 characters)
     - AI analysis response
     - Timestamp
     - Custom prompt used
   - Limited to 50 most recent entries
   - Automatically expires based on cache retention setting (default: 7 days)
   - Can be manually cleared via Settings

5. **Last Checked Hashes** (`lastCheckedHashes`)
   - SHA-256 hashes of recently checked emails for change detection
   - Limited to 20 most recent entries
   - Only stores hash values, not actual content

## Security Measures

### Input Validation and Sanitization

1. **API Endpoint Validation**
   - Must use HTTPS protocol
   - Cannot be localhost or private IP addresses
   - Must be a Google API domain (googleapis.com)

2. **Content Sanitization**
   - Email content is sanitized before being sent to the API
   - Removes common prompt injection patterns
   - Limits content length to 10,000 characters
   - Removes markdown code blocks and instruction tags
   - Removes AI jailbreak patterns (e.g., "ignore previous instructions")

3. **Custom Prompt Sanitization**
   - Limited to 5,000 characters
   - Removes prompt injection patterns
   - Template names limited to 100 characters

4. **XSS Prevention**
   - Analysis results are displayed using `textContent` (not `innerHTML`)
   - No user-generated HTML is rendered

### Cache Security

1. **Automatic Expiration**
   - Cached data automatically expires after the configured retention period
   - Default retention: 7 days (configurable 1-365 days)
   - Expired entries are automatically cleaned up

2. **Manual Cache Clearing**
   - Users can manually clear all cached data via Settings
   - Includes confirmation dialog to prevent accidental deletion

3. **Size Limits**
   - Cache limited to 50 most recent entries
   - Oldest entries automatically removed when limit is reached

## Privacy Considerations

### Data Transmission

- Email content is transmitted to Google's Gemini API for analysis
- Data is sent over HTTPS
- Subject to [Google's Privacy Policy](https://policies.google.com/privacy)

### Data Storage

- All data is stored locally in Thunderbird's profile directory
- No data is transmitted to third parties except Google's Gemini API
- API key is stored in plain text (limitation of browser.storage.local)

### Recommendations for Sensitive Emails

For emails containing sensitive or confidential information:

1. **Clear Cache Regularly**
   - Use the "Clear All Cached Data" button in Settings
   - Consider clearing cache after handling sensitive emails

2. **Reduce Cache Retention**
   - Set cache retention to 1 day for sensitive work
   - Configure in Settings → Cache Retention Days

3. **Disable Caching** (Manual Approach)
   - Clear cache before and after each use
   - Note: This will require API calls for every email check

4. **Review Privacy Policy**
   - Understand that email content is sent to Google's AI service
   - Review Google's data handling practices

5. **Consider Not Using the Add-on**
   - For highly confidential emails, consider not using AI review
   - Rely on manual review instead

## Reporting Security Vulnerabilities

If you discover a security vulnerability in this add-on, please report it by:

1. Opening a GitHub issue with the tag `security`
2. Providing detailed information about the vulnerability
3. Not publicly disclosing the vulnerability until it has been addressed

## Limitations

### Browser Storage Security

- `browser.storage.local` does not provide encryption
- API keys are stored in plain text
- Anyone with access to your Thunderbird profile directory can read stored data
- This is a limitation of the WebExtension API

### No End-to-End Encryption

- Email content is transmitted to Google's servers
- Content is not encrypted end-to-end (beyond HTTPS in transit)
- Google may process and analyze the data according to their privacy policy

### Local System Security

- Security depends on the security of your local system
- Malware or unauthorized access to your computer could expose stored data
- Keep your system secure with up-to-date antivirus and security patches

## Best Practices

1. **API Key Management**
   - Treat your API key like a password
   - Don't share your API key
   - Rotate your API key periodically
   - Use API key restrictions in Google Cloud Console

2. **System Security**
   - Keep Thunderbird updated
   - Keep your operating system updated
   - Use strong passwords/encryption for your user account
   - Enable disk encryption if handling sensitive data

3. **Cache Management**
   - Regularly clear cache for sensitive emails
   - Adjust retention period based on your security needs
   - Monitor what data is being cached

4. **Privacy Awareness**
   - Understand that AI services process your data
   - Review Google's privacy policy regularly
   - Be mindful of what content you submit for analysis

## Updates and Maintenance

- Security improvements are ongoing
- Check for updates regularly
- Review changelog for security-related fixes
- Report any security concerns via GitHub issues
