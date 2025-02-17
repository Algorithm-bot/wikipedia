from bertopic import BERTopic  # Correct import for BERTopic
import sys
import json

# Load the pre-trained BERT-VI model
try:
    model = BERTopic.load("RenatoBarreira/BERT-VI")
except Exception as e:
    print(f"Error loading model: {e}")
    sys.exit(1)  # Exit the script if the model fails to load

def classify_article(article_content):
    try:
        # Extract topics from the article content using BERTopic
        topics, probabilities = model.transform([article_content])
        
        # Get the most relevant topic
        top_topic = topics[0]
        
        # Map the topic ID to predefined tags
        topic_tag_mapping = {
            0: "#science",
            1: "#sports",
            2: "#history",
            3: "#art",
            4: "#technology"
        }
        topic_tags = [topic_tag_mapping.get(top_topic, "#general")]
        return topic_tags
    except Exception as e:
        print(f"Error during classification: {e}")
        return []

if __name__ == "__main__":
    # Ensure that an argument is passed from Node.js
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No article content provided"}))
        sys.exit(1)
    
    # Receive the article content from Node.js
    article_content = sys.argv[1]
    
    # Classify the article
    tags = classify_article(article_content)
    
    # Return the tags as a JSON response
    print(json.dumps({"tags": tags}))