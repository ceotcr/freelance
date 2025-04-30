import React from 'react'
import { StyleProvider } from '@ant-design/cssinjs';
import { ConfigProvider } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const Providers = ({ children }: { children: React.ReactNode }) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                retry: false,
            },
        },
    });
    return (
        <StyleProvider layer>
            <ConfigProvider theme={{
                token: {
                    fontFamily: "Raleway, sans-serif"
                }
            }}>
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
            </ConfigProvider>
        </StyleProvider>

    )
}

export default Providers