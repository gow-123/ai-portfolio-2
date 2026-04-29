-- Enable the pgvector extension to work with embedding vectors
CREATE EXTENSION IF NOT EXISTS vector;

-- Create a table for storing portfolio projects, skills, and their embeddings
-- We use 1536 dimensions commonly for OpenAI text-embedding-ada-002 or 1024 for Cohere/Claude embeddings. 
-- Adjust the vector size as necessary for your specific embedding model.
CREATE TABLE portfolio_content (
    id BIGSERIAL PRIMARY KEY,
    content_type VARCHAR(50) NOT NULL, -- 'project', 'skill', 'experience'
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    embedding vector(1536),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create a table for chat history logs
CREATE TABLE chat_logs (
    id BIGSERIAL PRIMARY KEY,
    session_id UUID DEFAULT gen_random_uuid(),
    role VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create an HNSW index for fast semantic search on the vectors
CREATE INDEX ON portfolio_content USING hnsw (embedding vector_cosine_ops);
