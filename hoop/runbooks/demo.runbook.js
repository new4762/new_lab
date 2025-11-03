node -e "console.log({{ .output
         | type "text"
         | required "output is required"
         | default "hello world"
}})"
