from openai import OpenAI

from app.config import ( LM_STUDIO_URL , MODEL_NAME )


class LLMClient:
    

    def  __init__(self):
        self.client = OpenAI(base_url=LM_STUDIO_URL,
                             api_key = "lm_studio")
        self.model_name = MODEL_NAME

    def generate(self,prompt):

        try:

            response = self.client.chat.completions.create(
                model = self.model_name,
                messages = [
                    {"role": "user" , "content" : prompt}

                ]
            )
            return response.choices[0].message.content
        
        except Exception as e:
            return f"Error generating response: {str(e)}"