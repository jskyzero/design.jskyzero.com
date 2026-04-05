import os
import requests
import json

# 配置
CLARITY_TOKEN = os.environ.get('CLARITY_TOKEN')
GIST_TOKEN = os.environ.get('GIST_TOKEN')
GIST_ID = "你的_GIST_ID"

def update_gist():
    # 1. 获取当前 Gist 数据
    gist_url = f"https://api.github.com/gists/{GIST_ID}"
    headers = {"Authorization": f"token {GIST_TOKEN}"}
    gist_resp = requests.get(gist_url, headers=headers).json()
    
    # 解析旧总数
    file_content = json.loads(gist_resp['files']['clarity-stats.json']['content'])
    current_total = int(file_content['message'])

    # 2. 获取 Clarity 昨日增量
    clarity_url = "https://www.clarity.ms/export-data/api/v1/project-live-insights"
    clarity_headers = {"Authorization": f"Bearer {CLARITY_TOKEN}", "Content-type": "application/json"}
    clarity_data = requests.get(clarity_url, params={"numOfDays": "1"}, headers=clarity_headers).json()
    
    daily_increment = 0
    for metric in clarity_data:
        if metric.get('metricName') == 'Traffic':
            daily_increment = int(metric.get('information', [{}])[0].get('totalSessionCount', 0))
            break

    # 3. 计算新总数
    new_total = current_total + daily_increment
    file_content['message'] = str(new_total)

    # 4. 更新 Gist
    update_data = {
        "files": {
            "clarity-stats.json": {
                "content": json.dumps(file_content)
            }
        }
    }
    requests.patch(gist_url, headers=headers, json=update_data)
    print(f"Gist updated: {current_total} + {daily_increment} = {new_total}")

if __name__ == "__main__":
    update_gist()