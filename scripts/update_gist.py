import os
import sys
import requests
import json

# 配置（敏感信息与 Gist ID 均可通过环境变量/secret 覆盖）
CLARITY_TOKEN = os.environ.get('CLARITY_TOKEN')
GIST_TOKEN = os.environ.get('GIST_TOKEN')
GIST_ID = os.environ.get('GIST_ID', "2b7d19a42054b8eff6e4b9b228a80079")
FILE_NAME = "clarity-stats.json"
REQUEST_TIMEOUT = 30  # 秒


def fail(msg):
    """输出错误并以非零码退出，让 GitHub Action 能感知失败。"""
    print(f"错误: {msg}", file=sys.stderr)
    sys.exit(1)


def update_gist():
    if not CLARITY_TOKEN or not GIST_TOKEN:
        fail("缺少 CLARITY_TOKEN 或 GIST_TOKEN 环境变量")

    gist_url = f"https://api.github.com/gists/{GIST_ID}"
    headers = {
        "Authorization": f"Bearer {GIST_TOKEN}",
        "Accept": "application/vnd.github.v3+json"
    }

    print(f"正在请求 Gist: {gist_url}")
    try:
        gist_resp = requests.get(gist_url, headers=headers, timeout=REQUEST_TIMEOUT)
    except requests.RequestException as e:
        fail(f"获取 Gist 失败: {e}")

    if gist_resp.status_code != 200:
        fail(f"获取 Gist 失败! 状态码: {gist_resp.status_code}")

    data = gist_resp.json()

    # 检查文件是否存在于 Gist 中
    if 'files' not in data or FILE_NAME not in data['files']:
        fail(f"在 Gist 中找不到文件 '{FILE_NAME}'，现有文件: {list(data.get('files', {}).keys())}")

    # 解析旧总数
    try:
        content_str = data['files'][FILE_NAME]['content']
        file_content = json.loads(content_str)
        current_total = int(file_content.get('message', 0))
    except (json.JSONDecodeError, ValueError) as e:
        fail(f"解析 Gist 内容失败: {e}")

    # 获取 Clarity 昨日增量
    clarity_url = "https://www.clarity.ms/export-data/api/v1/project-live-insights"
    clarity_headers = {
        "Authorization": f"Bearer {CLARITY_TOKEN}",
        "Content-type": "application/json"
    }

    try:
        clarity_resp = requests.get(
            clarity_url, params={"numOfDays": "1"},
            headers=clarity_headers, timeout=REQUEST_TIMEOUT
        )
        clarity_resp.raise_for_status()
        clarity_data = clarity_resp.json()

        daily_increment = 0
        for metric in clarity_data:
            if metric.get('metricName') == 'Traffic':
                info = metric.get('information', [{}])[0]
                daily_increment = int(info.get('totalSessionCount', 0))
                break
    except (requests.RequestException, ValueError) as e:
        fail(f"获取 Clarity 数据失败: {e}")

    # 计算新总数
    new_total = current_total + daily_increment
    file_content['message'] = str(new_total)

    # 更新 Gist
    update_payload = {
        "files": {
            FILE_NAME: {
                "content": json.dumps(file_content, indent=2)
            }
        }
    }

    try:
        patch_resp = requests.patch(gist_url, headers=headers, json=update_payload, timeout=REQUEST_TIMEOUT)
    except requests.RequestException as e:
        fail(f"更新 Gist 失败: {e}")

    if patch_resp.status_code == 200:
        print(f"更新成功: {current_total} + {daily_increment} = {new_total}")
    else:
        fail(f"更新 Gist 失败: {patch_resp.status_code}")


if __name__ == "__main__":
    update_gist()
