import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRoutes } from './routes';
import { DefaultLayout } from './components/Layout';
import { Fragment, useEffect } from 'react';
import * as SIP from 'sip.js';

function App() {
    /**
     * Khai bao 1 so cong cu de lien lac voi sip server
     * @function initCall
     * @param {string} username - ten dang nhap
     * @param {string} password - mat khau
     * @param {string} host - dia chi sip server
     * @param {string} wsServer - dia chi ws server
     */
    const initCall = () => {
        const username = 'athena_100073';
        const password = '6cDbTGI4GY8EXHfp19mOuS5k4r3g24FG';
        const wsServer = 'wss://pbx-athenaspear-dev.athenafs.io:7443';
        var config = {
            uri: 'athena_100073@pbx-athenaspear-dev.athenafs.io',
            wsServers: [wsServer], // +':7443'
            authorizationUser: username,
            password,
        };
        console.log('config call ______________________', config);
        let remoteAudio = document.getElementById('remoteAudio');
        if (!remoteAudio) {
            remoteAudio = document.createElement('audio');
            remoteAudio.id = 'remoteAudio';
            document.body.appendChild(remoteAudio);
        }
        try {
            const sip = new SIP.WebRTC.Simple({
                media: {
                    remote: {
                        audio: remoteAudio,
                    },
                },
                ua: config,
            });
            console.log('sip _________', sip);
            global.ua = sip;
        } catch (error) {
            console.error(error);
            alert('ERROR initPhone:' + error.message);
            throw error;
        }

        global.ua.on('registered', (e) => {
            console.log('registered ____________________________________ đã đăng ký thành công', e);
        });
        global.ua.on('unregistered', (e) => {
            console.log('unregistered_________đang vào unregistered', e);
        });
        global.ua.on('registrationFailed', (e) => {
            console.log('registrationFailed', e);
        });
        global.ua.on('ringing', (e) => {
            console.log('ringring_ có người gọi đến nè', e);
        });
        global.ua.on('disconnected', (e) => {
            console.log('disconnected__________khong kết nối được', e);
        });
        global.ua.on('connected', (e) => {
            console.log('đã connected', e);
        });

        global.ua.on('hold', (e) => {
            console.log('hold', e);
        });
        global.ua.on('dtmf', (e) => {
            console.log('dtmf', e);
        });
        global.ua.on('unhold', (e) => {
            console.log('unhold', e);
        });
        global.ua.on('connecting', (e) => {
            console.log('connecting', e);
        });
        global.ua.on('ended', (e) => {
            console.log('ended', e);
        });
        const userAgent = global.ua.ua;
        console.log('userAgent________', userAgent);

        global.ua.ua.on('disconnected', () => {
            console.log('disconnected ws');
        });
        global.ua.ua.on('connecting', () => {
            console.log('connecting ws');
        });
        global.ua.ua.on('connected', () => {
            console.log('WebSocket đã kết nối');
        });
        return global.ua;
    };
    useEffect(() => {
        initCall();
    }, []);
    return (
        <Router>
            <div className="App">
                <Routes>
                    {publicRoutes.map((route, index) => {
                        let Layout = DefaultLayout;
                        if (route?.layout) {
                            Layout = route.layout;
                        } else if (route.layout === null) {
                            Layout = Fragment;
                        }
                        const Page = route.component;
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <Layout>
                                        <Page />
                                    </Layout>
                                }
                            />
                        );
                    })}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
