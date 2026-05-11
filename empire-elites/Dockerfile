FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install uv for fast package management
RUN pip install uv

# Copy only dependency files first for better caching
COPY empire-elites/pyproject.toml /app/pyproject.toml
COPY empire-elites/uv.lock /app/uv.lock

# Install dependencies
RUN uv sync --frozen --no-dev

# Copy the actual source
COPY empire-elites/src/ /app/src/
COPY empire-elites/knowledge/ /app/knowledge/

# Set Python path
ENV PYTHONPATH=/app

# Expose port
EXPOSE 8080

# Default command
CMD ["python", "-m", "the_empire_elites.main", "run"]