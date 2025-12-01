import Router from "./router";
import { ConfigProvider, theme, App as AntApp } from 'antd';

function App() {
    return (
        <ConfigProvider
            theme={{
                algorithm: theme.darkAlgorithm,
                token: {
                    colorPrimary: '#9146ff',
                    colorBgContainer: '#1f1f1f',
                    colorBgElevated: '#262626',
                    colorBorder: '#434343',
                },
            }}
        >
            <AntApp>
                <Router />
            </AntApp>
        </ConfigProvider>
    );
}

export default App;
