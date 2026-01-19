# ---------- BUILD FRONTEND ----------
    FROM node:24-alpine AS frontend-builder

    WORKDIR /frontend
    
    # Kopiraj samo package.json i package-lock za cache instalacije
    COPY frontend/package*.json ./
    
    RUN npm install
    
    COPY frontend/ ./
    
    # Build frontend
    RUN npm run build
    
    # ---------- BUILD BACKEND ----------
    FROM node:24-alpine AS backend
    
    WORKDIR /app
    
    # Instaliraj backend dependencies
    COPY backend/package*.json ./
    RUN npm install
    
    # Kopiraj backend kod
    COPY backend/ ./
    
    # Kopiraj frontend build u backend
    COPY --from=frontend-builder /frontend/dist ./frontend/dist
    
    EXPOSE 8080
    
    CMD ["node", "login.js"]    