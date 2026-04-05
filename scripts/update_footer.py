import os
import requests
import re
import json
from datetime import datetime

# 1. 配置
TOKEN = os.environ.get('CLARITY_TOKEN')
FOOTER_PATH = '_theme/_includes/footer.html'

def update_footer():
    # 2. 获取 Clarity 昨日增量
    url = "https://www.clarity.ms/export-data/api/v1/project-live-insights"
    params = {"numOfDays": "1"}
    headers = {"Authorization": f"Bearer {TOKEN}", "Content-type": "application/json"}
    
    try:
        response = requests.get(url, params=params, headers=headers)
        response.raise_for_status()
        api_data = response.json()
        
        daily_increment = 0
        for metric in api_data:
            if metric.get('metricName') == 'Traffic':
                info = metric.get('information', [{}])[0]
                daily_increment = int(info.get('totalSessionCount', 0))
                break
        
        print(f"Yesterday's increment: {daily_increment}")

        # 3. 读取 HTML 文件并更新总数
        with open(FOOTER_PATH, 'r', encoding='utf-8') as f:
            content = f.read()

        # 使用正则查找底数标记 <!-- CLARITY_TOTAL:数字 -->
        match = re.search(r'<!-- CLARITY_TOTAL:(\d+) -->', content)
        if not match:
            print("Error: Could not find CLARITY_TOTAL comment in footer.html")
            return

        old_total = int(match.group(1))
        new_total = old_total + daily_increment
        print(f"Updating: {old_total} -> {new_total}")

        # 4. 替换 HTML 内容
        # 更新注释中的总数
        new_content = re.sub(r'<!-- CLARITY_TOTAL:\d+ -->', f'<!-- CLARITY_TOTAL:{new_total} -->', content)
        # 更新 Shields.io 图片链接中的数字
        new_content = re.sub(r'img.shields.io/badge/sessions-\d+-violet', f'img.shields.io/badge/sessions-{new_total}-violet', new_content)

        # 5. 写回文件
        with open(FOOTER_PATH, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print("Footer updated successfully.")

    except Exception as e:
        print(f"Failed to update footer: {e}")
        exit(1)

if __name__ == "__main__":
    update_footer()