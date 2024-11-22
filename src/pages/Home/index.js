import React from 'react';
import './styles.scss';

function Home(props) {
    const callOut = () => {
        const number = '11628_0996620706_0979308884@pbx-athenaspear-dev.athenafs.io';
        console.log('nó đang gọi vào call nè kiểm tra thử ua xem ', global.ua);
        try {
            // var fixed = number.replace(/[^a-zA-Z0-9*#/.@]/g, '')
            var session = global.ua.call(number);
            // them doan ben duoi
            console.log('callout -------', number);
            session.on('progress', (response) => {
                console.log('process', response);
                if (response.status_code === 183 && response.body && session.hasOffer) {
                    console.log('process 2222', response.body);
                    if (response.status_code === 183 && response.body && session.hasOffer && !session.dialog) {
                        console.log('session.hasOffe');
                        if (!response.hasHeader('require') || response.getHeader('require').indexOf('100rel') === -1) {
                            console.log('require 100rel');
                        }
                    } else {
                        console.log(' !session.dialog');
                    }
                    if (response.status_code === 183) {
                        var pc = session.sessionDescriptionHandler.peerConnection;
                        var remoteStream = new MediaStream();
                        if (pc.getReceivers) {
                            pc.getReceivers().forEach(function (receiver) {
                                var rtrack = receiver.track;
                                if (rtrack) {
                                    remoteStream.addTrack(rtrack);
                                }
                            });
                        } else {
                            remoteStream = pc.getRemoteStreams()[0];
                        }
                        var remoteAudio = document.getElementById('remoteAudio');
                        remoteAudio.srcObject = remoteStream;
                        remoteAudio
                            .play()
                            .then((res) => {
                                console.log('vào đây và bật nhạc heheheh');
                            })
                            .catch(function () {
                                session.logger.log('local play was rejected');
                            });

                        session.createDialog(response, 'UAC');
                        session.hasAnswer = true;
                        session.status = 11;
                        session.sessionDescriptionHandler.setDescription(response.body).catch(function (exception) {
                            session.logger.warn(exception);
                            // session.failed(response, C.causes.BAD_MEDIA_DESCRIPTION)
                            session.acceptAndTerminate({ status_code: 488, reason_phrase: 'Bad Media Description' });
                        });
                    }
                }
            });
            if (session && session.connection) {
                session.connection.addEventListener('addstream', (e) => {
                    var audio = document.createElement('audio');
                    console.log('audio o day_____________', audio);
                    console.log('Create stream');
                    audio.srcObject = e.stream;
                    audio.play();
                });
            }
        } catch (error) {
            console.log('error call out', error);
        }
    };
    return (
        <div>
            <button onClick={callOut} className="btn-call">
                CLICK TO CALL
            </button>
        </div>
    );
}

export default Home;
