# Vue 3 管理面板--基于 TypeScript 的现代管理界面

一个全面的 Vue 3 管理控制面板，为构建企业级管理界面奠定了坚实的基础。该项目使用 TypeScript、Vue 3、Element Plus 和 Vite 构建，采用模块化架构，具有基于角色的访问控制、动态路由和丰富的预建组件集。

仪表盘采用现代的响应式界面，具有基本的管理功能，包括用户管理、部门组织、基于角色的权限和系统字典。它利用 Vue 3 的 Composition API 和 TypeScript 进行类型安全开发，同时通过 Vite 的快速构建工具提供无缝的开发体验。

## 目录结构

```text
.
├── src/                          # Source code directory
│   ├── components/              # Reusable Vue components
│   │   ├── ui/                 # UI components (Tables, Buttons, etc.)
│   │   └── PageHeaderWrapper/  # Page header component
│   ├── views/                  # Application views/pages
│   │   ├── UserList/          # User management views
│   │   ├── system/            # System management views
│   │   └── logIn/            # Authentication views
│   ├── store/                 # Pinia store modules
│   ├── router/                # Vue Router configuration
│   ├── utils/                 # Utility functions
│   ├── serivce/              # API service layer
│   └── hooks/                # Custom Vue composables
├── public/                    # Static assets
└── vite.config.ts            # Vite configuration
```

## Usage Instructions

### Prerequisites

- Node.js 16.x or later
- npm 7.x or later
- Modern web browser with ES2015+ support

### Installation

```bash
# Clone the repository
git clone https://github.com/geminglu/vite-vue3-dome.git

# Navigate to project directory
cd vite-vue3-dome

# Install dependencies
npm install
```

### Quick Start

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```
