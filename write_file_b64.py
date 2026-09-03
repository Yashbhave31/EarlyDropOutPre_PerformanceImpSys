import sys, os, base64
path = sys.argv[1]
b64_content = sys.argv[2].strip()
b64_content += '=' * (-len(b64_content) % 4)
full = os.path.join(os.getcwd(), path)
os.makedirs(os.path.dirname(full), exist_ok=True)
with open(full, 'wb') as f:
    f.write(base64.b64decode(b64_content))
print('Successfully wrote: ' + path)
