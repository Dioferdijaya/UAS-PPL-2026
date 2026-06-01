import type { HttpContext } from '@adonisjs/core/http'
import Booking from '#models/booking'
import Schedule from '#models/schedule'
import { createBookingValidator } from '#validators/user'

export default class PublicBookingController {
  public async show({ params, view }: HttpContext) {
    const schedule = await Schedule.findOrFail(params.id)
    const bookings = await Booking.query().where('schedule_id', schedule.id)
    
    // Create array of booked seat numbers
    const bookedSeats = bookings.map((booking) => booking.seatNumber)
    const seatNumbers = Array.from({ length: schedule.totalSeats }, (_, index) => index + 1)
    
    return view.render('pages/booking', { schedule, bookedSeats, seatNumbers })
  }

  public async store({ auth, request, response, session }: HttpContext) {
    console.log('Store method called')
    console.log('Request body:', request.all())
    
    try {
      const payload = await request.validateUsing(createBookingValidator)
      console.log('Validation passed:', payload)

      // Cek apakah kursi sudah di-booking di jadwal yang sama
      const exists = await Booking.query()
        .where('schedule_id', payload.schedule_id)
        .where('seat_number', payload.seat_number)
        .first()
      if (exists) {
        session.flash('errors', { seat: 'Kursi sudah di-booking, silakan pilih kursi lain.' })
        return response.redirect('back')
      }

      await Booking.create({
        scheduleId: payload.schedule_id,
        userId: auth.user!.id,
        passengerName: payload.passenger_name,
        passengerPhone: payload.passenger_phone,
        seatNumber: payload.seat_number,
        status: 'pending',
      })
      console.log('Booking created successfully')
      session.flash('success', 'Booking berhasil! Silakan lakukan pembayaran.')
      return response.redirect('/dashboard')
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log('Error:', error.message)
      } else {
        console.log('Error:', error)
      }
      console.log('Error details:', error)
      throw error
    }
  }
}
