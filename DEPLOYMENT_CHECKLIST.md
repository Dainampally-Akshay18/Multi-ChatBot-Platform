# 🚀 Deployment Checklist

## Pre-deployment

- [ ] All environment variables configured in Netlify
- [ ] GROQ API key added to Netlify environment variables
- [ ] Frontend build completes without errors
- [ ] Backend functions structure is correct
- [ ] All dependencies listed in requirements files
- [ ] CORS origins updated for production domain

## Netlify Setup

- [ ] Repository connected to Netlify
- [ ] Build command set: `./build.sh`
- [ ] Publish directory set: `frontend/dist`  
- [ ] Functions directory set: `backend/netlify/functions`
- [ ] Environment variables configured:
  - [ ] `GROQ_API_KEY`
  - [ ] `NODE_ENV=production`
  - [ ] `PYTHON_VERSION=3.9`

## Post-deployment

- [ ] Homepage loads correctly
- [ ] All chatbot endpoints accessible
- [ ] Chat functionality works
- [ ] API health check passes
- [ ] No console errors
- [ ] Mobile responsiveness verified
- [ ] Performance metrics acceptable

## Environment Variables Needed

