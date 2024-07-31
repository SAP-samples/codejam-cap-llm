# Exercise 03 - Explore Generative AI Hub in SAP AI Launchpad

## Use the Chat in Generative AI Hub
👉 Open the Generative AI Hub tab and select Chat. Now click Configure and have a look at the available fields. 

The selected model will show your model once it is deployed. If there is no deployment this will be empty and you will not be able to chat. If you have more than one large language model deployed you will be able to select which one you want to use here. 

The parameter frequency penalty allows you to penalize words that appear too frequently in the text, leading to the model not sounding too robotic. Similarly the higher the presence penalty, the more likely the model will talk about new topics, as you penalize words that have appeared in the text so far. With Max Tokens you can set the size of the input and output of the model. Where tokens are not words but rather 4-5 characters long. With the Temperature parameter you can set how creative the model should sound so flexible the model is allowed to be in selecting the next token in the sequence.

![Chat 1/2](assets/2024-07-22_15-32-44.png)

In the Chat Context tab right under Context History you can set the number of messages that should be send to the model. So how much of the chat history should be provided as context to the model for each new request. You can add a System Message to describe the role or give more information of what is expected from the model. You can also provide example inputs and outputs.

![Chat 2/2](assets/2024-07-22_15-40-33.png)

## Prompt Engineering
👉 Try out different prompt engineering techniques following these examples:

1. Zero shot:
   ```sh
    The capital of the U.S. is:
    ``` 
2. Few shot:
    ```sh
    Germany - Berlin
    France - Paris
    U.S. - 
    ```
3. Chain of thought:
    ```sh
    1. What is the most important city of a country?
    2. In which country was the Internet originally developed?
    3. What is the - fill in the word from step 1 - of the country - fill in the word from step 2 -.
    ```

☝️ [This](https://www.promptingguide.ai/) is a good recourse if you want to know more.

## Use the Prompt Editor in Generative AI Hub

## Summary

At this point ...

## Further reading

* ...

---

## Questions

If you finish earlier than your fellow participants, you might like to ponder these questions. There isn't always a single correct answer and there are no prizes - they're just to give you something else to think about.

---

[Next exercise](../03-deploy-llm/README.md)
