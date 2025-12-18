# Talk to Celebrities - AI Chat Application

A full-stack AI-powered celebrity chat application built with Next.js 14, TypeScript, and OpenAI GPT-4o-mini. Have realistic conversations with 10 famous personalities, each with unique speaking styles and personalities.

## Features

- 🎭 **10 Celebrity Personas**: Chat with Albert Einstein, Morgan Freeman, Shah Rukh Khan, Amitabh Bachchan, Robert De Niro, Meryl Streep, Denzel Washington, Tom Hanks, Priyanka Chopra, and Marie Curie
- 💬 **Real-time Streaming**: Streaming responses for natural conversation flow
- 🎨 **Beautiful UI**: Modern, responsive design with Tailwind CSS and shadcn/ui
- 🔑 **UI-based API Configuration**: Enter your OpenAI API key directly in the app (no server setup required)
- 🔐 **Authentication**: NextAuth.js with Google OAuth (optional)
- 💾 **Local Database**: SQLite for chat history (no external database needed)
- 🚀 **Type-safe**: Full TypeScript implementation
- 📱 **Responsive**: Works seamlessly on desktop and mobile
- 🎯 **Zero Configuration**: Works out of the box - just add your API key via the UI

## Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** components
- **React Markdown** for formatted responses
- **Lucide React** for icons

### Backend
- **Next.js API Routes**
- **Prisma ORM**
- **SQLite** database (local, no setup required)
- **NextAuth.js** for authentication (optional)

### AI
- **OpenAI API** (GPT-4o-mini)
- **Streaming responses** with Server-Sent Events

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

**That's it!** No database setup or external services required.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/celebrity-chat.git
   cd celebrity-chat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Initialize the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Configure your API key**

   Open [http://localhost:3000](http://localhost:3000) and click the "API Settings" button in the top right. Enter your OpenAI API key and you're ready to chat!

   **Note**: Your API key is stored securely in your browser's local storage and never sent to any server except OpenAI's API.

### Optional: Add Celebrity Images

You can optionally add celebrity images for a better experience:

   Add celebrity images to `public/celebrities/` with these filenames:
   - einstein.jpg
   - morgan-freeman.jpg
   - amitabh.jpg
   - srk.jpg
   - deniro.jpg
   - meryl.jpg
   - denzel.jpg
   - tom-hanks.jpg
   - priyanka.jpg
   - marie-curie.jpg

   Images should be square (1:1 aspect ratio) and at least 400x400px. If no images are provided, the app will use placeholder avatars.

## Project Structure

```
celebrity-chat/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/   # NextAuth API route
│   │   │   ├── celebrities/          # Get celebrities list
│   │   │   └── chat/                 # Chat streaming & save
│   │   ├── chat/[celebrityId]/       # Chat page
│   │   ├── globals.css               # Global styles
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Home page
│   ├── components/
│   │   ├── ui/                       # shadcn/ui components
│   │   ├── CelebrityGrid.tsx         # Celebrity selection grid
│   │   └── ChatInterface.tsx         # Chat UI with streaming
│   └── lib/
│       ├── auth.ts                   # NextAuth configuration
│       ├── celebrities.ts            # Celebrity personas & prompts
│       ├── openai.ts                 # OpenAI streaming service
│       ├── prisma.ts                 # Prisma client
│       └── utils.ts                  # Utility functions
├── prisma/
│   └── schema.prisma                 # Database schema
├── public/
│   └── celebrities/                  # Celebrity images
├── .env.example                      # Environment variables template
└── package.json
```

## Usage

### Basic Conversation

1. Visit the home page
2. Select a celebrity from the grid
3. Start chatting! Each celebrity has:
   - Unique speaking style
   - Accurate biographical information
   - Characteristic phrases and mannerisms
   - Domain expertise

### Example Prompts

**For Einstein:**
- "Can you explain your theory of relativity?"
- "What do you think about quantum mechanics?"
- "Tell me about your time at Princeton"

**For Morgan Freeman:**
- "What's your favorite role you've played?"
- "Tell me about narrating documentaries"
- "What advice would you give to aspiring actors?"

**For Shah Rukh Khan:**
- "Tell me about your journey in Bollywood"
- "What's your philosophy on romance?"
- "How did you become King Khan?"

## Customization

### Adding New Celebrities

1. Add celebrity data to `src/lib/celebrities.ts`:
   ```typescript
   {
     id: 'unique-id',
     name: 'Celebrity Name',
     category: 'hollywood' | 'bollywood' | 'scientist' | 'artist',
     bio: 'Brief biography',
     imageUrl: '/celebrities/image.jpg',
     era: '1950-present',
     systemPrompt: `Detailed prompt for AI behavior...`,
     personaConfig: {
       speakingStyle: 'Description',
       catchphrases: ['phrase 1', 'phrase 2'],
       traits: ['trait1', 'trait2'],
       expertise: ['topic1', 'topic2']
     }
   }
   ```

2. Add celebrity image to `public/celebrities/`

3. Restart the development server

### Modifying AI Parameters

Edit `src/lib/openai.ts` to adjust:
- `temperature`: Creativity (0.0-1.0)
- `max_tokens`: Response length
- `frequency_penalty`: Reduce repetition
- `presence_penalty`: Encourage topic diversity

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

**Users configure their API keys via the UI**, so you only need these environment variables for optional features:

- `NEXTAUTH_URL` - Your production URL (optional, for authentication)
- `NEXTAUTH_SECRET` - Random secret for JWT encryption (optional, for authentication)
- `GOOGLE_CLIENT_ID` - (Optional) Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - (Optional) Google OAuth secret
- `OPENAI_API_KEY` - (Optional) Fallback server-side API key if users don't provide their own

### Database Setup

The SQLite database will be created automatically. Just run:
```bash
npx prisma generate
npx prisma db push
```

**Note**: For production with persistent storage, consider upgrading to a managed database service.

## Performance Considerations

- **Streaming**: Responses stream in real-time for better UX
- **Database Indexing**: Key queries are indexed for performance
- **API Rate Limiting**: Consider implementing rate limiting for production
- **Caching**: Celebrity data is static and can be cached

## Security Notes

- **API Key Storage**: User API keys are stored in browser local storage and never sent to your server
- **Server-side Processing**: All OpenAI API calls happen server-side, protecting user keys
- **No Key Logging**: API keys are never logged or stored in server databases
- **Client-side Encryption**: Keys are stored locally and only sent to OpenAI's official API
- User authentication is optional but recommended for production
- Database queries use Prisma's SQL injection protection

## Troubleshooting

### Common Issues

**"API key not configured" or "Failed to get response"**
- Click the "API Settings" button and enter your OpenAI API key
- Verify your API key is correct (starts with `sk-`)
- Check you have OpenAI API credits available
- Ensure your API key hasn't been revoked

**"Database errors"**
- Run `npx prisma generate` to regenerate the Prisma client
- Run `npx prisma db push` to sync the database schema
- Delete `prisma/dev.db` and run `npx prisma db push` again to reset

**"Celebrity images not showing"**
- Verify images are in `public/celebrities/`
- Check filenames match exactly
- Ensure images are valid formats (jpg, png)

**"Streaming not working"**
- Check browser supports streaming (all modern browsers do)
- Verify API route is returning `ReadableStream`
- Check for CORS issues

## Future Enhancements

- [ ] Voice mode with text-to-speech
- [ ] Chat history UI for saved conversations
- [ ] User profiles and preferences
- [ ] Multi-language support
- [ ] Celebrity "mood" variations
- [ ] Image generation for celebrity avatars
- [ ] Mobile app (React Native)
- [ ] Admin dashboard for analytics

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Acknowledgments

- OpenAI for GPT-4o-mini API
- shadcn/ui for beautiful components
- Vercel for Next.js and hosting
- All the celebrities who inspire this project

## Support

For issues and questions:
- Open an issue on GitHub
- Check existing issues for solutions
- Read the troubleshooting section

---

**Note**: This application is for entertainment and educational purposes. The AI responses are generated and don't represent actual statements from the celebrities.

Built with ❤️ using Next.js and OpenAI