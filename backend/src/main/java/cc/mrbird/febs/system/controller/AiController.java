package cc.mrbird.febs.system.controller;

import com.theokanning.openai.completion.chat.ChatCompletionChoice;
import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.completion.chat.ChatMessageRole;
import com.theokanning.openai.service.OpenAiService;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.*;

public class AiController {
    
    @GetMapping("choices")
    public List<ChatCompletionChoice> createChatCompletion(String content, Integer num, Integer length) {


        OpenAiService service = new OpenAiService("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");
        final List<ChatMessage> messages = new ArrayList<>();
        final ChatMessage systemMessage = new ChatMessage(ChatMessageRole.SYSTEM.value(), content);
        messages.add(systemMessage);

        ChatCompletionRequest chatCompletionRequest = ChatCompletionRequest
                .builder()
                .model("gpt-3.5-turbo")
                .messages(messages)
                .n(num)
                .maxTokens(length)
                .logitBias(new HashMap<>())
                .build();

        List<ChatCompletionChoice> choices = service.createChatCompletion(chatCompletionRequest).getChoices();
        System.out.println("choices = " + choices);
        //写入数据库
        return choices;
    }
}
