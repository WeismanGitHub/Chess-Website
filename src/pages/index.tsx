import { ScriptProps } from 'next/script'
import Layout from '../components/Layout'
import React from 'react'

const Blog: React.FC<ScriptProps> = (props) => {
    console.log(props)

    return (
        <Layout>
            <div className="page">
                <main>
                    <h1>Hello World</h1>
                </main>
            </div>
        </Layout>
    )
}

export default Blog
