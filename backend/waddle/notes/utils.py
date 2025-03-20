from transformers import BartForConditionalGeneration,BartTokenizer

model = BartForConditionalGeneration.from_pretrained("facebook/bart-large-cnn")
tokenizer=BartTokenizer.from_pretrained("facebook/bart-large-cnn")

def summarize_text(text,min_length=50,max_length=200):
    inputs=tokenizer.encode("summarize " + text, return_tensors="pt", max_length=1024, truncation=True)
    summary_ids = model.generate(
        inputs,
        max_length=max_length,   
        min_length=min_length,   
        length_penalty=2.0,
        num_beams=4,
        early_stopping=True
    )
    
    summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
    return summary