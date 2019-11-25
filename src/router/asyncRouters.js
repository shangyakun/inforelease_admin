
export const asyncRouter = [
        {
            path: '/system',
            name:'system',
            component:()=>import ('@/views/main/system')
        },
        {
            path: '/record',
            name:'record',
            component:()=>import ('@/views/main/record')
        },
        {
            path: '/release',
            name:'release',
            component:()=>import ('@/views/main/release')
        },
        {
            path: '/edit',
            name:'edit',
            component:()=>import ('@/views/main/edit')
        },
        {
            path: '/classify',
            name:'classify',
            component:()=>import ('@/views/main/classify')
        },
    ]
export const routes = [{
        path: '/',
        name: 'Layout',
        component: ()=>import ('@/views/layout/index'),
        children:[{
            path: '/edit',
            name:'edit',
            component:()=>import ('@/views/main/edit')
        },{
            path: '/record',
            name:'record',
            component:()=>import ('@/views/main/record')
        }]
    }]
