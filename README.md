# MyResume Frontend (Next.js)

Dự án frontend được chuyển đổi từ React sang Next.js với TypeScript.

## Tính năng

- **Client Pages**: Trang chủ, sản phẩm với UI hiện đại
- **Admin Panel**: Quản lý bài viết, người dùng với giao diện admin
- **Authentication**: Hệ thống đăng nhập cho admin
- **Responsive Design**: Tương thích với mọi thiết bị
- **Redux State Management**: Quản lý state toàn cục
- **Ant Design**: UI components hiện đại

## Cấu trúc dự án

```
src/app/
├── components/          # Shared components
├── config/             # API configuration
├── types/              # TypeScript types
├── redux/              # Redux store và actions
├── client/             # Client pages
│   ├── layout.tsx      # Client layout
│   ├── page.tsx        # Home page
│   ├── product/        # Product page
│   └── home/           # Home page styles
├── admin/              # Admin pages
│   ├── layout.tsx      # Admin layout
│   ├── page.tsx        # Admin dashboard
│   ├── auth/           # Authentication
│   ├── article/        # Article management
│   └── user/           # User management
└── globals.css         # Global styles
```

## Cài đặt

1. Cài đặt dependencies:
```bash
npm install
```

2. Tạo file `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

3. Chạy development server:
```bash
npm run dev
```

4. Build cho production:
```bash
npm run build
```

## Routing

### Client Routes
- `/` - Redirect to `/client`
- `/client` - Home page
- `/client/product` - Product page

### Admin Routes
- `/admin` - Redirect to `/admin/article`
- `/admin/auth/login` - Login page
- `/admin/article` - Article management
- `/admin/article/create` - Create article
- `/admin/article/update` - Update article
- `/admin/article/trash` - Trash management
- `/admin/user` - User management

## Technologies

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Ant Design** - UI components
- **Redux Toolkit** - State management
- **Axios** - HTTP client
- **React Icons** - Icon library
- **TinyMCE** - Rich text editor

## Features

- **Server-Side Rendering** với Next.js
- **File-based Routing** tự động
- **TypeScript** cho type safety
- **Responsive Design** với Ant Design
- **State Management** với Redux
- **API Integration** với Axios
- **Authentication** với JWT
- **Rich Text Editor** với TinyMCE

## Development

Dự án sử dụng:
- **ESLint** cho code linting
- **TypeScript** cho type checking
- **Next.js** cho development server và build
- **Ant Design** cho UI components
