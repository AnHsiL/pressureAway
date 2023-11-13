const {OpenAI} = require("openai");
const openai = new OpenAI({
    apiKey: "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",
});

module.exports = class ChatGPTAPI {
    
    static async helloGPT() {
        try {
            const chatCompletion = await openai.chat.completions.create({
                model:"gpt-3.5-turbo",
                messages: [{"role": "user", "content": "員工壓力大時該提供什麼樣的零食?"}],
            })
            
            const completion_text = chatCompletion.choices[0].message;
            console.log("== completion_text: ");
            console.log(completion_text);
            return new Promise((resolve) => {
                resolve({message : completion_text});
            });
        } catch (e) {
            console.error("Error chat with chatgpt: ", e);
        }
    }
}