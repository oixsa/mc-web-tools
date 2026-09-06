#!/usr/bin/env bash
# Stitch Project: Kita Tools Website Redesign (7783438919071270023)
# Download script for hosted Stitch assets and code

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
mkdir -p "${SCRIPT_DIR}/downloads"

echo "Downloading Screen 1: Extracted text from https://www.pugtools.com/ ..."
curl -L "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAwMDY1YThlNDJiNWM1MjcwMzMyYzA2Y2VlM2I5NDJkEgsSBxDQ9u_hjBcYAZIBIwoKcHJvamVjdF9pZBIVQhM3NzgzNDM4OTE5MDcxMjcwMDIz&filename=&opi=89354086" -o "${SCRIPT_DIR}/downloads/1_pugtools_extracted_text.md"

echo "Downloading Screen 2 HTML: kita tools landing page ..."
curl -L "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAwMDY1YThlNTAyMTAyYTYwNjM5NzgxY2YyMTA0ZGFlEgsSBxDQ9u_hjBcYAZIBIwoKcHJvamVjdF9pZBIVQhM3NzgzNDM4OTE5MDcxMjcwMDIz&filename=&opi=89354086" -o "${SCRIPT_DIR}/downloads/2_kita_tools_landing.html"

echo "Downloading Screen 2 Screenshot: kita tools landing page (2560x11218) ..."
curl -L "https://lh3.googleusercontent.com/aida/AEtjO1VngXQy0F8nF0al2tssSrVYIVuLvm3eU2C4Z4YbU6enfIfwWxKSojAT-8Ldc1QGoKiqyTDkQuISkJFjjwoNnOKif-94y90wk0jqeivXWHpxjuWYugxQiYHvrAOUWPeKFDhWq56oMRDp-tSNAYgNDCpbT-mw-vzqRVJ3pD2r2LOb11JveXJhmBM_z0c6Kl3lt6qEjyTJ1GFm4UNvBE3KmhlZe5hFwVT_Osz_TOHqo3tfcMJTyJrXKpgzITI" -o "${SCRIPT_DIR}/downloads/2_kita_tools_landing_screenshot.png"

echo "Downloading Screen 5 Logo: kita tools logo (1024x1024) ..."
curl -L "https://lh3.googleusercontent.com/aida/AEtjO1WPouSOV8-jXXssncFsRb9UHbPGBpiAso5m0Q69Ww2PqC0PvKrRVVvbxg1k7rWoQoIjyBuIEo0Ue8s8pOzep75rrb44SwJBmoiOY6-zWNuDudgNjGu-etphKIQj0YG8GnlWUAwXTg-13vGPzEz8CJ6je8OI_7kO4N2sxy2sL8Z8krh_RAQxhgkRqsO-OGEa1un5BD_OlwqzxG2bGSTjqt5zhm7G5W9fe0BvenHdgXNeFbJBt8XxmqoS8g" -o "${SCRIPT_DIR}/downloads/5_kita_tools_logo.png"

echo "All downloads completed successfully!"
