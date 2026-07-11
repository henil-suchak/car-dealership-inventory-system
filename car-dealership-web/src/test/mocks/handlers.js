import { http, HttpResponse } from 'msw';

export const handlers = [
  http.post('http://localhost:8080/api/auth/login', async ({ request }) => {
    const body = await request.json();
    if (body.email === 'admin@dealership.com' && body.password === 'password123') {
      return HttpResponse.json({
        accessToken: 'mock.admin.token',
        refreshToken: 'mock.refresh.token'
      });
    }
    return new HttpResponse(null, { status: 401 });
  }),
  
  http.get('http://localhost:8080/api/vehicles', () => {
    return HttpResponse.json({
      content: [
        { id: '1', make: 'Toyota', model: 'Camry', price: 25000, quantityInStock: 5 }
      ],
      totalElements: 1
    });
  })
];
