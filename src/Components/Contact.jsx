import { useState } from 'react'

function Contact({ id }) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState(null) // null | 'sending' | 'success' | 'error'

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')

    try {
      const res = await fetch('https://formspree.io/f/xlgkyvpl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        setStatus('success')
        setForm({ name: '', email: '', subject: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id={id} className="w-full min-h-screen flex items-center justify-center px-6 md:px-16 lg:px-32">
      <div className="w-full max-w-3xl mx-auto">

        {/* Header */}
        <h2
          className="text-4xl font-light tracking-tight text-slate-700 mb-14"
          style={{ fontFamily: "'Lobster', cursive" }}
        >
          Contact
        </h2>

        {/* Divider */}
        <div className="border-t border-slate-500 mb-10" />

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          {/* Name + Email row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs uppercase tracking-widest font-mono text-slate-500">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. John Smith"
                required
                className="bg-slate-700 text-orange-200 placeholder-orange-200/40 border-b border-slate-500 px-2.5 py-2 text-sm outline-none focus:border-slate-400 transition-colors duration-200 rounded"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs uppercase tracking-widest font-mono text-slate-500">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="YourEmail@example.com"
                required
                className="bg-slate-700 text-orange-200 placeholder-orange-200/40 border-b border-slate-500 px-2.5 py-2 text-sm outline-none focus:border-slate-400 transition-colors duration-200 rounded"
              />
            </div>
          </div>

          {/* Subject */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs uppercase tracking-widest font-mono text-slate-500">
              Subject
            </label>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="Got something specific?"
              required
              className="bg-slate-700 text-orange-200 placeholder-orange-200/40 border-b border-slate-500 px-2.5 py-2 text-sm outline-none focus:border-slate-400 transition-colors duration-200 rounded"
            />
          </div>

          {/* Message */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs uppercase tracking-widest font-mono text-slate-500">
              Message
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Spill the beans..."
              required
              rows={6}
              className="bg-slate-700 text-orange-200 placeholder-orange-200/40 border-b border-slate-500 px-2.5 py-2 text-sm outline-none focus:border-slate-400 transition-colors duration-200 resize-none rounded"
            />
          </div>

          {/* Submit row */}
          <div className="flex items-center justify-end gap-6 mt-4">

            {/* Status message */}
            {status === 'success' && (
              <p className="text-sm font-mono text-slate-400 tracking-wide">
                Sent. I'll get back to you soon.
              </p>
            )}
            {status === 'error' && (
              <p className="text-sm font-mono text-rose-900 tracking-wide">
                Something went wrong. Try again.
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="group px-9 py-3 text-sm font-medium tracking-widest text-slate-600 border border-transparent hover:border-slate-700 hover:bg-slate-700 hover:text-orange-200 rounded transition-all duration-200 disabled:opacity-50"
              style={{ fontFamily: "'Oswald', sans-serif" }}
            >
              {status === 'sending' ? 'Sending...' : 'Send my way!'}
            </button>

          </div>
        </form>

      </div>
    </section>
  )
}

export default Contact