WikiWebView.js
1. This file contains the web view browser where wikipedia articles can be opened inside my own app rather than redirecting to the users browser.
2. Might not need to modify during deployment

WikiFeed.js
1. The main file, all the content which will be displayed is written here.
2. All the new changes have to be made in this file 

Server.js
1. This is the server file.
2. i have kept the url at my localhost IP address so i have to make changes during deployment
3. i think the server not working.
4. create a dummy server to understand how to implement using postman.
5. Use GET request to see if server working.


topic_classifier.py
1. It is an Text parsing model which will parse the article and categorize them according to tags i.e-#history, #science, etc.
2. I downloaded it from Hugging face - https://huggingface.co/RenatoBarreira/BERT-VI

POST Request
1. body>raw>json



2. { 
    "content": "Science is a systematic discipline that builds and organises knowledge in the form of testable hypotheses and predictions about the universe.[1][2] Modern science is typically divided into two or three major branches:[3] the natural sciences (e.g., physics, chemistry, and biology), which study the physical world; and the social sciences (e.g., economics, psychology, and sociology), which study individuals and societies.[4][5] The formal sciences (e.g., logic, mathematics, and theoretical computer science), which study formal systems governed by axioms and rules,[6][7] are sometimes described as being sciences as well; however, they are often regarded as a separate field because they rely on deductive reasoning instead of the scientific method or empirical evidence as their main methodology.[8][9] Applied sciences are disciplines that use scientific knowledge for practical purposes, such as engineering and medicine.[10][11][12]"

}