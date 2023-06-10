# cybersecurity_final

# Oauth 2.0 Server
## Setup
1. Create a conda environment (you can name it whatever you want, "oauth2" is just an example):
    ``` bash 
    conda create -n "oauth2"
    conda activate oauth2
    ```
1. Then install the dependencies:
    ``` bash 
    pip install -r ./oauth2_server/server/requirements.txt
    ```
## Run 
1. Make sure no other app is running on port 5000. 
1. Activate conda environment set up in the previous step:
    ``` bash 
    conda activate oauth2
    ```
1. Start the server:
    ``` bash 
    flask run
    ```
The oauth 2.0 server should be running on http://localhost:5000