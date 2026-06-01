import type { HttpContext } from '@adonisjs/core/http'
import Testimonial from '#models/testimonial'

export default class TestimonialsController {
  async create({ view, auth }: HttpContext) {
    const user = auth.user
    return view.render('pages/testimonial_form', { user })
  }

  async store({ request, response, auth, session }: HttpContext) {
    const user = auth.user!

    const name = request.input('name')
    const message = request.input('message')

    // Simple validation
    const errors: Record<string, string> = {}

    if (!name || name.trim().length < 3 || name.trim().length > 100) {
      errors.name = 'Nama harus minimal 3 karakter dan maksimal 100 karakter'
    }

    if (!message || message.trim().length < 10 || message.trim().length > 500) {
      errors.message = 'Pesan harus minimal 10 karakter dan maksimal 500 karakter'
    }

    if (Object.keys(errors).length > 0) {
      session.flash('errors', errors)
      // preserve old input so `old('...')` helper works in the view
      session.flash('old', { name: name || '', message: message || '' })
      return response.redirect('/testimonial/create')
    }

    await Testimonial.create({
      userId: user.id,
      name: name.trim(),
      message: message.trim(),
      approved: true,
    })

    return response.redirect('/dashboard')
  }

  async getApproved() {
    return await Testimonial.query().where('approved', true).orderBy('created_at', 'desc').limit(3)
  }
}
