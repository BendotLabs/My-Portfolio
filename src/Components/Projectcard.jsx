import { ExternalLink } from 'Lucide-react'

function ProjectCard({ media, title, description, tags = [], liveUrl, githubUrl }) {
  return (
    <div className="flex flex-col items-center text-center">

      {/* Media — no box, no crop, sits directly on the page background */}
      <div className="w-full flex justify-center">
        {media}
      </div>

      {/* Title — only rendered when the media itself isn't already the name (i.e. bottom two cards) */}
      {title && (
        <h3
          className="text-2xl text-slate-700 mt-4"
          style={{ fontFamily: "'Lobster', cursive" }}
        >
          {title}
        </h3>
      )}

      {/* Description */}
      <p className="text-sm text-slate-600 leading-relaxed mt-4 max-w-sm">
        {description}
      </p>

      {/* Divider */}
      <div className="w-full max-w-xs border-t border-slate-500 mt-6 mb-5" />

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs text-orange-200 bg-slate-700 rounded px-2.5 py-1"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Divider */}
      <div className="w-full max-w-xs border-t border-slate-500 mt-6 mb-5" />

      {/* Links */}
      <div className="flex items-center justify-center gap-6">
        {liveUrl && (
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium tracking-widest uppercase text-slate-600 hover:text-slate-500 transition-colors duration-200 inline-flex items-center gap-1"
            style={{ fontFamily: "'Oswald', sans-serif" }}
          >
            Live Demo <ExternalLink size={16} />
          </a>
        )}
        {githubUrl && (
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium tracking-widest uppercase text-slate-600 hover:text-slate-500 transition-colors duration-200 inline-flex items-center gap-1"
            style={{ fontFamily: "'Oswald', sans-serif" }}
          >
            GitHub <ExternalLink size={16} />
          </a>
        )}
      </div>

    </div>
  )
}

export default ProjectCard