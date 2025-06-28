# API Testing Guide

## Current Issues Fixed:

### 1. PDF Parsing

- ✅ Added comprehensive logging
- ✅ Better error handling
- ✅ Clear error messages

### 2. OpenAI API

- ✅ API key validation
- ✅ Graceful error handling
- ✅ Helpful error messages

### 3. UI Feedback

- ✅ Better loading states
- ✅ Detailed error messages
- ✅ Console logging for debugging

## Testing Steps:

### 1. Test PDF Upload

```bash
# Test with a text file (should fail with proper error)
curl -X POST http://localhost:3000/api/parse-pdf -F "file=@test.txt"

# Test with a PDF file
curl -X POST http://localhost:3000/api/parse-pdf -F "file=@your-pdf-file.pdf"
```

### 2. Test Chat API

```bash
# Test without API key (should show helpful error)
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"test","context":"test context"}'
```

### 3. Check Server Logs

Watch the terminal where the server is running for detailed logs.

## Next Steps:

1. **Add your OpenAI API key** to `.env.local`
2. **Test with a simple text-based PDF**
3. **Use the text input option** for complex PDFs
4. **Check browser console** for client-side errors
