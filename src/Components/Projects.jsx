import Projectcard from './Projectcard'
import Gamegridlogo from './Gamegridlogo'
import Pongscanlogo from './Pongscanlogo'
import Videothumb from './Videothumb'
import qLearningDemo from '../assets/q-learning-demo.mp4'
import dqnDemo from '../assets/dqn-demo.mp4'
import { ExternalLink } from 'Lucide-react'

function Projects({ id }) {
  return (
    <section id={id} className="w-full min-h-screen flex items-center justify-center py-20 px-6 md:px-16 lg:px-32">
      <div className="max-w-5xl mx-auto w-full">

        {/* Header */}
        <h2
          className="text-4xl font-light tracking-tight text-slate-700 mb-14"
          style={{ fontFamily: "'Lobster', cursive" }}
        >
          Projects
        </h2>

        {/* 2x2 grid → 1 column on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">

          {/* GameGrid — the wordmark itself is the name, no separate title */}
          <Projectcard
            media={<Gamegridlogo />}
            title={null}
            description="A game recommendation web app with two discovery paths — filter by genre and platform, or rate games you've played to build a taste profile that surfaces similar highly-rated titles. Features a real-time autocomplete search, an inline details panel pulling from the RAWG API, and a persistent SQLite-backed taste profile."
            tags={['Python', 'Flask', 'SQLite', 'Jinja2', 'JavaScript']}
            liveUrl="https://gamegrid-i8qo.onrender.com"
            githubUrl="https://github.com/BendotLabs/Game-Rec-Web"
          />

          {/* ASE Pong — the animated PONG wordmark is the name, no separate title */}
          <Projectcard
            media={<Pongscanlogo mode="cycle" />}
            title={null}
            description="A two-player Pong build with an adversarial twist — built as a sandbox for experimenting with reactive, systems-driven game logic."
            tags={['JavaScript', 'HTML', 'CSS']}
            githubUrl="https://github.com/BendotLabs/ASE-Pong"
          />

          {/* DQN Visualizer — no logo, video shown full size, title displayed below */}
          <Projectcard
            media={<Videothumb src={dqnDemo} label="DQN agent learning a maze, heatmap glowing outward from the goal" />}
            title="DQN Visualizer"
            description="A deep Q-learning agent that learns to navigate a maze using a neural network instead of a lookup table. A live heatmap shows the network's understanding spreading outward from the goal as it trains, powered by experience replay for stable learning."
            tags={['Python', 'PyTorch', 'Pygame', 'NumPy']}
            githubUrl="https://github.com/BendotLabs/DQN-Visualizer"
          />

          {/* Q-Learning Visualizer — no logo, video shown full size, title displayed below */}
          <Projectcard
            media={<Videothumb src={qLearningDemo} label="Q-learning agent solving a hand-drawn maze, heatmap updating live" />}
            title="Q-Learning Visualizer"
            description="An interactive reinforcement learning visualizer built from scratch. Draw a custom maze, place the goal, and watch a Q-learning agent explore, learn, and converge on the optimal path through a live-updating value heatmap."
            tags={['Python', 'Pygame', 'NumPy']}
            githubUrl="https://github.com/BendotLabs/Q-Learning-Visualizer"
          />

        </div>

        {/* See more on GitHub */}
        <div className="flex justify-center mt-16">
          <a
            href="https://github.com/BendotLabs"
            target="_blank"
            rel="noopener noreferrer"
            className="group px-9 py-3 text-sm font-medium tracking-widest text-slate-600 border border-transparent hover:border-slate-700 hover:bg-slate-700 hover:text-orange-200 rounded transition-all duration-200 inline-flex items-center gap-1"
            style={{ fontFamily: "'Oswald', sans-serif" }}
          >
            See more on my GitHub <ExternalLink size={16} />
          </a>
        </div>

      </div>
    </section>
  )
}

export default Projects