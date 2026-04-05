import os
import requests
import json

# 配置
CLARITY_TOKEN = os.environ.get('CLARITY_TOKEN')
GIST_TOKEN = os.environ.get('GIST_TOKEN')
GIST_ID = "2b7d19a42054b8eff6e4b9b228a80079"  # 确保这里只有字符串，不要包含 URL 路径
FILE_NAME = "clarity-stats.json"

def update_gist():
    # 1. 获取当前 Gist 数据
    gist_url = f"https://api.github.com/gists/{GIST_ID}"
    headers = {
        "Authorization": f"token {GIST_TOKEN}",
        "Accept": "application/vnd.github.v3+json"
    }
    
    print(f"正在请求 Gist: {gist_url}")
    gist_resp = requests.get(gist_url, headers=headers)
    
    if gist_resp.status_code != 200:
        print(f"获取 Gist 失败! 状态码: {gist_resp.status_code}")
        print(f"响应内容: {gist_resp.text}")
        return

    data = gist_resp.json()
    
    # 检查文件是否存在于 Gist 中
    if 'files' not in data or FILE_NAME not in data['files']:
        print(f"错误: 在 Gist 中找不到文件 '{FILE_NAME}'")
        print(f"当前 Gist 内的文件有: {list(data.get('files', {}).keys())}")
        return

    # 解析旧总数
    try:
        content_str = data['files'][FILE_NAME]['content']
        file_content = json.loads(content_str)
        current_total = int(file_content.get('message', 0))
    except (json.JSONDecodeError, ValueError) as e:
        print(f"解析 Gist 内容失败: {e}")
        return

    # 2. 获取 Clarity 昨日增量
    clarity_url = "https://www.clarity.ms/export-data/api/v1/project-live-insights"
    clarity_headers = {
        "Authorization": f"Bearer {CLARITY_TOKEN}", 
        "Content-type": "application/json"
    }
    
    try:
        clarity_resp = requests.get(clarity_url, params={"numOfDays": "1"}, headers=clarity_headers)
        clarity_resp.raise_for_status()
        clarity_data = clarity_resp.json()
        
        daily_increment = 0
        for metric in clarity_data:
            if metric.get('metricName') == 'Traffic':
                info = metric.get('information', [{}])[0]
                daily_increment = int(info.get('totalSessionCount', 0))
                break
    except Exception as e:
        print(f"获取 Clarity 数据失败: {e}")
        return

    # 3. 计算新总数
    new_total = current_total + daily_increment
    file_content['message'] = str(new_total)

    # 4. 更新 Gist
    update_payload = {
        "files": {
            FILE_NAME: {
                "content": json.dumps(file_content, indent=2)
            }
        }
    }
    
    patch_resp = requests.patch(gist_url, headers=headers, json=update_payload)
    if patch_resp.status_code == 200:
        print(f"更新成功: {current_total} + {daily_increment} = {new_total}")
    else:
        print(f"更新 Gist 失败: {patch_resp.status_code}, {patch_resp.text}")

if __name__ == "__main__":
    update_gist()