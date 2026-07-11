import { http, HttpResponse, delay } from 'msw';

// In-memory mock data
let mockUsers = [
  { email: 'admin@dealership.com', password: 'password123', role: 'ADMIN' }
];

let mockVehicles = [
  { id: '1', make: 'Toyota', model: 'Camry', year: 2023, price: 25000, quantityInStock: 5, category: 'SEDAN' },
  { id: '2', make: 'Honda', model: 'Civic', year: 2022, price: 22000, quantityInStock: 0, category: 'SEDAN' },
  { id: '3', make: 'Ford', model: 'F-150', year: 2024, price: 45000, quantityInStock: 2, category: 'TRUCK' },
  { id: '4', make: 'Tesla', model: 'Model 3', year: 2023, price: 40000, quantityInStock: 10, category: 'SEDAN' },
];

const createFakeJwt = (payload) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  return `${header}.${body}.signature`;
};

export const handlers = [
  // Auth Mocks
  http.post('http://localhost:8080/api/auth/register', async ({ request }) => {
    await delay(500); // Simulate network latency
    const body = await request.json();
    if (mockUsers.find(u => u.email === body.email)) {
      return HttpResponse.json({ message: 'Email already in use' }, { status: 400 });
    }
    mockUsers.push({ email: body.email, password: body.password, role: 'USER' });
    return HttpResponse.json({ message: 'User registered successfully' }, { status: 201 });
  }),
  
  http.post('http://localhost:8080/api/auth/login', async ({ request }) => {
    await delay(500);
    const body = await request.json();
    const user = mockUsers.find(u => u.email === body.email && u.password === body.password);
    
    if (user) {
      const fakeJwt = createFakeJwt({ 
        sub: user.email, 
        roles: user.role === 'ADMIN' ? ['ROLE_ADMIN'] : ['ROLE_USER'] 
      });
      return HttpResponse.json({
        accessToken: fakeJwt,
        refreshToken: 'mock.refresh.token'
      });
    }
    return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }),
  
  // Vehicle Mocks
  http.get('http://localhost:8080/api/vehicles', async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const make = url.searchParams.get('make');
    
    let filteredVehicles = [...mockVehicles];
    if (make) {
      filteredVehicles = filteredVehicles.filter(v => v.make.toLowerCase().includes(make.toLowerCase()));
    }
    
    return HttpResponse.json({
      content: filteredVehicles,
      totalElements: filteredVehicles.length
    });
  }),
  
  http.post('http://localhost:8080/api/vehicles', async ({ request }) => {
    await delay(500);
    const body = await request.json();
    const newVehicle = { id: String(Date.now()), ...body };
    mockVehicles.push(newVehicle);
    return HttpResponse.json(newVehicle, { status: 201 });
  }),
  
  http.put('http://localhost:8080/api/vehicles/:id', async ({ request, params }) => {
    await delay(500);
    const body = await request.json();
    mockVehicles = mockVehicles.map(v => v.id === params.id ? { ...v, ...body } : v);
    return HttpResponse.json({ ...body, id: params.id });
  }),
  
  http.delete('http://localhost:8080/api/vehicles/:id', async ({ params }) => {
    await delay(500);
    mockVehicles = mockVehicles.filter(v => v.id !== params.id);
    return new HttpResponse(null, { status: 204 });
  }),
  
  http.post('http://localhost:8080/api/vehicles/:id/purchase', async ({ params }) => {
    await delay(500);
    const vehicle = mockVehicles.find(v => v.id === params.id);
    if (!vehicle || vehicle.quantityInStock <= 0) {
      return new HttpResponse(null, { status: 400 });
    }
    mockVehicles = mockVehicles.map(v => 
      v.id === params.id ? { ...v, quantityInStock: v.quantityInStock - 1 } : v
    );
    return new HttpResponse(null, { status: 200 });
  }),
  
  http.post('http://localhost:8080/api/vehicles/:id/restock', async ({ request, params }) => {
    await delay(500);
    const url = new URL(request.url);
    const quantity = parseInt(url.searchParams.get('quantity') || '1', 10);
    
    mockVehicles = mockVehicles.map(v => 
      v.id === params.id ? { ...v, quantityInStock: v.quantityInStock + quantity } : v
    );
    return new HttpResponse(null, { status: 200 });
  })
];
