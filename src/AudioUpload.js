import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-fileinput/css/fileinput.min.css';
import 'bootstrap-fileinput/js/fileinput.min.js';
import $ from 'jquery';

const AudioUpload = ({ setAudioURL, setAudioName }) => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-fileinput/5.1.5/js/fileinput.min.js';
        script.async = true;
        script.onload = () => {
            try {
                // 初始化 fileinput 插件
                $('#audioUpload').fileinput({
                    allowedFileExtensions: ['mp3', 'wav', 'ogg'],
                    showUpload: false,
                    dropZoneEnabled: false,
                    maxFileCount: 1,
                    mainClass: 'input-group-lg'
                }).on('fileloaded', function(event, file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        setAudioURL(e.target.result);
                        setAudioName(file.name);
                        localStorage.setItem('audioURL', e.target.result);
                        localStorage.setItem('audioName', file.name);
                    };
                    reader.readAsDataURL(file);
                });
            } catch (error) {
                console.error('Error initializing fileinput:', error);
            }
        };
        script.onerror = (error) => {
            console.error('Error loading script:', error);
        };
        document.body.appendChild(script);

        return () => {
        document.body.removeChild(script);
        };
    }, [setAudioURL, , setAudioName]);

    return (
        <div className="container mt-4">
            <h2>Upload Audio File</h2>
            <div className="file-loading">
                <input id="audioUpload" name="audioUpload" type="file" accept="audio/*" />
            </div>
        </div>
    );
};

export default AudioUpload;
