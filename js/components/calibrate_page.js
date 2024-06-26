import logger from "../modules/logger.js";

let camera_support = false;
export default {
    NorthOff:Number.NaN,
    get_camera_support: ()=>{return camera_support},
    content: `
<div class="slide-container calibrate-slider">
    <div visible="true"  data-ref="slide1">
        <section>
            <main>

                <svg id="sun" width="289" height="289" viewBox="0 0 289 289" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="144.5" cy="144.5" r="125.246" fill="#FFEA7B" stroke="#F6EBB1" stroke-width="37.4923" />
                </svg>

                <svg id="handedPhone" width="1251" height="1853" viewBox="0 0 1251 1853" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="handed phone">
                        <path id="Vector 27" d="M613.921 571.103C683.373 839.522 845.426 986.271 917.771 1026.09L845.425 1392.12C699.905 1339.94 545.518 1260.86 443.186 1143.02C350.584 1036.38 414.518 964.669 460.549 876.124L496 883V433.835C548.887 444.813 591.767 485.481 613.921 571.103Z" fill="#AF815A" />
                        <g id="iPhone 7">
                            <rect id="Rectangle 2" y="129.152" width="13.5949" height="44.1835" rx="3.39873" fill="#313131" />
                            <rect id="Rectangle 3" y="217.519" width="13.5949" height="74.7721" rx="6.79746" fill="#313131" />
                            <rect id="Rectangle 5" x="506.411" y="217.519" width="13.5949" height="74.7721" rx="6.79746" fill="#313131" />
                            <rect id="Rectangle 4" y="312.683" width="13.5949" height="74.7721" rx="6.79746" fill="#313131" />
                            <rect id="Rectangle 6" x="217.519" y="61.1772" width="84.9683" height="10.1962" rx="5.09809" fill="#6A6A6A" />
                            <circle id="Ellipse 1" cx="178.433" cy="66.2753" r="8.49683" fill="#161519" />
                            <circle id="Ellipse 2" cx="258.303" cy="972.037" r="40.7848" fill="#1F1F1F" />
                            <path id="Subtract" fill-rule="evenodd" clip-rule="evenodd" d="M81.5695 0C38.3969 0 3.39868 34.9982 3.39868 78.1707L3.39868 968.638C3.39868 1011.81 38.397 1046.81 81.5695 1046.81H438.436C481.609 1046.81 516.607 1011.81 516.607 968.638L516.607 78.1708C516.607 34.9983 481.609 0 438.436 0L81.5695 0ZM479.221 129.152L40.7847 129.152L40.7847 910.86H479.221L479.221 129.152Z" fill="#1A1A1A" />
                            <rect id="Rectangle 8" x="41" y="129" width="438" height="89" fill="black" fill-opacity="0.2" />
                            <rect id="Rectangle 9" x="41" y="751" width="438" height="160" fill="black" />
                        </g>
                        <path id="Vector 28" d="M206.103 873.605L526.354 1216.26L676.381 1096.96C651.377 1019.13 541.356 845.685 301.313 774.616C61.2695 703.546 137.822 810.996 206.103 873.605Z" fill="#AF815A" />
                        <path id="Vector 29" d="M912.048 1006.59L652.356 1327.09L1250.43 1852.91V1255.55L912.048 1006.59Z" fill="#D62246" />
                    </g>
                </svg>

                <svg id="leftHand" width="1096" height="1224" viewBox="0 0 1096 1224" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="left hand">
                        <path id="hand" d="M665.5 636C607.973 678.18 451.056 907.956 440.588 962.192L224.469 842.142L289.626 595.386C297.937 531.718 264.443 358.449 289.626 308.259C311.854 263.957 338.829 259.808 364.336 266.188C370.59 255.954 457.067 224.624 476.826 251.867C493.968 235.485 572.539 228.804 570.724 262.208C619.45 170.204 643.117 123.625 707.599 46.7225C746.014 0.908593 827.049 -11.9826 790.19 90.5018C744.427 217.744 755.389 192.221 707.599 298.942C645.946 436.618 673.716 442.827 799.855 390.135C830.5 377.333 832.681 358.5 868.5 358.5C900.908 358.5 936.017 382.108 864.364 455.731C776.192 546.327 735.811 584.446 665.5 636Z" fill="#A07047" />
                        <path id="Vector 30" d="M253.466 681.807L460.423 961.54L381.961 1223.08L14 1166.5L253.466 681.807Z" fill="#D62246" />
                    </g>
                </svg>
            </main>
            <nav>
                Please align your device with the sun and tap your screen to continue.
                <div>
                    <button data-ref="calib_continue1">Continue</button>
                </div>
            </nav>
        </section>
    </div>
    <video data-ref="camera1" autoplay playsinline webkit-playsinline muted></video>
    <div data-ref="slide2">
    <section>
            <main>
        <svg id="legs2" width="954" height="1085" viewBox="0 0 954 1085" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g>
                <g id="left2">
                    <path id="Vector 31"
                        d="M438.809 255.091C441.273 360.618 403.907 484.52 403.907 531.226C403.907 577.933 418.279 665.701 426.491 772.46C434.703 879.218 317.679 971.092 276.618 975.198C235.557 979.305 170.373 863.307 170.373 796.583C170.373 729.859 178.072 773.486 170.373 609.756C162.674 446.025 129.312 496.325 129.312 312.577C129.312 128.829 209.894 4.61914 294.583 4.61914C379.271 4.61914 435.73 123.183 438.809 255.091Z"
                        fill="#EEEEEE" />
                    <path id="Vector 45"
                        d="M144.71 394.186C144.71 178.837 209.894 69.8039 287.91 57.9988C365.926 46.1937 420.948 207.871 425.464 296.153C431.11 406.504 395.545 470.148 406.987 548.678C446.474 819.68 406.987 936.191 284.831 971.606C199.269 996.411 176.532 786.493 176.532 616.942C176.532 572.801 144.71 473.741 144.71 394.186Z"
                        fill="#252726" />
                    <g id="Group 2">
                        <path id="Vector 41"
                            d="M360.793 249.959L206.543 256.645C204.252 256.744 203.823 259.955 206.008 260.652L357.398 308.928C358.906 309.408 359.326 311.342 358.154 312.405L339.073 329.711C338.843 329.919 338.568 330.073 338.27 330.16L188.171 374.104C186.324 374.645 186.169 377.201 187.938 377.961L355.704 449.999C357.454 450.75 357.326 453.273 355.509 453.844L188.326 506.36C186.469 506.943 186.39 509.542 188.208 510.237L361.942 576.58C363.932 577.34 363.59 580.255 361.477 580.533L190.39 603.083"
                            stroke="#EEEEEE" stroke-width="20.5305" />
                        <path id="Vector 42"
                            d="M350.528 265.87L193.849 313.469C192.002 314.03 191.88 316.598 193.666 317.332L372.225 390.686C374.081 391.449 373.854 394.147 371.896 394.588L188.243 435.934C186.312 436.369 186.053 439.014 187.863 439.815L372.178 521.357C374.024 522.174 373.707 524.884 371.722 525.253L190.214 558.989C188.115 559.379 187.932 562.316 189.966 562.964L367.466 619.508"
                            stroke="white" stroke-width="20.5305" />
                    </g>
                    <g id="Group 5">
                        <path id="Vector 34"
                            d="M356.174 226.349L395.695 175.536L426.491 272.029V351.072L402.881 501.458L414.173 614.375L420.332 748.337C371.23 741.664 278.877 716.822 302.281 670.834C325.686 624.846 331.195 548.678 331.024 516.342C331.195 456.975 332.461 330.131 336.157 297.692C339.852 265.254 351.041 236.614 356.174 226.349Z"
                            fill="#3D3F3E" />
                        <path id="Vector 33"
                            d="M219.133 233.021L179.099 167.323L151.896 280.241L146.25 411.636L174.992 605.136L179.099 704.196C194.496 588.199 226.216 348.197 229.912 316.17C233.607 284.142 224.266 247.392 219.133 233.021Z"
                            fill="#3D3F3E" />
                    </g>
                    <path id="Vector 35"
                        d="M210.921 180.668C193.675 180.668 183.889 171.087 181.152 166.297L204.248 118.05L241.203 80.5822L280.211 57.4854L313.573 60.0517L356.174 93.4137C370.545 117.708 398.775 167.324 396.722 171.43C394.669 175.536 378.415 179.3 370.545 180.668H210.921Z"
                        fill="white" />
                    <path id="Vector 32"
                        d="M144.71 394.186C144.71 178.837 209.894 69.8039 287.91 57.9988C365.926 46.1937 420.948 207.871 425.464 296.153C431.11 406.504 395.545 470.148 406.987 548.678C446.474 819.68 406.987 936.191 284.831 971.606C199.269 996.411 176.532 786.493 176.532 616.942C176.532 572.801 144.71 473.741 144.71 394.186Z"
                        stroke="black" stroke-width="13.3448" />
                </g>
                <g id="right2">
                    <path id="Vector 36"
                        d="M490.649 300.772C490.649 99.832 557.886 0 617.425 0C760.625 0 802.199 224.296 803.226 318.223C803.742 365.443 765.758 492.219 765.758 735.505C765.758 849.308 680.043 953.068 633.849 960.314C607.673 964.42 528.117 940.81 524.524 757.575C519.362 494.272 490.649 398.805 490.649 300.772Z"
                        fill="#EEEEEE" />
                    <path id="Vector 46"
                        d="M505.02 328.488C499.272 134.68 582.523 46.1936 634.362 46.1936C686.202 46.1936 722.643 95.9801 745.74 139.094C777.237 197.889 791.265 391.106 776.536 495.298C748.82 691.365 780.642 678.533 741.121 815.574C709.504 925.207 543.324 941.837 532.736 815.574C525.893 733.965 510.769 522.296 505.02 328.488Z"
                        fill="#252726" />
                    <path id="Vector 38"
                        d="M564.045 168.35C543.515 167.94 533.934 158.256 531.71 153.466L568.151 81.6088L603.053 54.9191L627.69 45.6804L667.724 51.8396L704.679 81.6088C720.762 102.995 752.618 148.128 751.386 157.572C750.154 167.016 731.711 170.403 722.643 170.916C678.332 170.232 584.576 168.761 564.045 168.35Z"
                        fill="white" />
                    <path id="Vector 37"
                        d="M505.02 328.488C499.272 134.68 582.523 46.1936 634.362 46.1936C686.202 46.1936 722.643 95.9801 745.74 139.094C777.237 197.889 791.265 391.106 776.536 495.298C748.82 691.365 780.642 678.533 741.121 815.574C709.504 925.207 543.324 941.837 532.736 815.574C525.893 733.965 510.769 522.296 505.02 328.488Z"
                        stroke="black" stroke-width="13.3448" />
                    <g id="Group 3">
                        <path id="Vector 43"
                            d="M735.475 253.552H567.732C565.426 253.552 564.871 256.767 567.044 257.539L726.637 314.304C728.434 314.943 728.464 317.475 726.681 318.156L561.622 381.196C559.775 381.902 559.895 384.553 561.797 385.09L737.243 434.6C739.142 435.135 739.266 437.781 737.424 438.491L569.524 503.253C567.659 503.972 567.817 506.661 569.753 507.157L723.654 546.57C725.741 547.105 725.701 550.083 723.6 550.561L555.833 588.712"
                            stroke="#EEEEEE" stroke-width="20.5305" />
                        <path id="Vector 44"
                            d="M726.75 263.304L558.171 315.707C556.234 316.309 556.25 319.056 558.194 319.635L747.127 375.882C749.057 376.457 749.092 379.178 747.177 379.802L553.51 442.912C551.582 443.541 551.634 446.285 553.584 446.839L734.799 498.342C736.818 498.916 736.776 501.792 734.742 502.307L559.17 546.792C557.133 547.308 557.095 550.189 559.118 550.758L726.75 597.951"
                            stroke="white" stroke-width="20.5305" />
                    </g>
                    <g id="Group 4">
                        <path id="Vector 39"
                            d="M590.735 323.355C588.271 219.881 549.332 173.483 530.17 163.217L512.206 215.57L504.507 289.993L532.736 787.344L552.754 783.752C552.754 783.752 596.381 687.258 596.381 664.161C596.381 647.224 583.036 645.171 583.036 627.207C583.036 609.242 593.199 426.829 590.735 323.355Z"
                            fill="#3D3F3E" />
                        <path id="Vector 40"
                            d="M701.086 397.778C690.411 245.853 732.224 181.866 754.466 168.863L770.89 220.703L781.155 339.78V446.025L770.89 524.554L760.625 655.949L764.218 704.709L753.439 772.46L701.086 743.717C694.414 736.018 682.609 706.865 688.768 651.843C696.467 583.066 714.431 587.685 701.086 397.778Z"
                            fill="#3D3F3E" />
                    </g>
                </g>
                <path id="Vector 47"
                    d="M417.534 490.282C374.756 392.801 178.335 389.201 144.943 490.282C139.408 507.039 139.537 517.335 137.699 534.887C134.319 567.168 141.469 585.761 137.699 617.999C134.124 648.579 126.018 664.63 119.972 694.82C104.426 772.434 95.3014 895.264 95.0073 899.258C94.9981 899.384 94.9798 899.419 94.94 899.539L1.05822 1181.82C0.764204 1182.71 1.32468 1183.64 2.24239 1183.8L473.19 1266.23C474.031 1266.38 474.828 1265.81 474.96 1264.96L531.862 899.65C531.892 899.457 531.899 899.321 531.855 899.131C530.466 893.166 501.914 771.012 474.721 694.82C458.174 648.458 438.399 625.961 427.446 577.968C419.778 544.37 431.382 521.839 417.534 490.282Z"
                    fill="#002856" />
                <path id="Vector 48"
                    d="M785.817 505.913C738.051 405.619 575.198 406.906 501.789 490.282C490.682 502.897 484.225 510.382 477.389 525.738C462.192 559.878 486.541 585.198 477.389 621.43C469.562 652.418 453.948 665.525 441.171 694.82C407.864 771.184 380.553 899.358 380.553 899.358L358.5 1172L954 1203.5L862.066 914.227C862.066 914.227 859.948 789.361 839.572 712.929C826.223 662.854 776.938 637.896 793.06 588.643C795.591 580.914 799.348 577.438 801.448 569.581C808.057 544.846 796.825 529.028 785.817 505.913Z"
                    fill="#002856" />
            </g>
        </svg>

        <svg id="handedPhone2" width="1738" height="2574" viewBox="0 0 1738 2574" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <g id="handed phone">
                <path id="Vector 27"
                    d="M853.469 793.126C949.921 1165.9 1174.97 1369.69 1275.44 1425L1174.97 1933.32C972.88 1860.86 758.474 1751.03 616.359 1587.38C487.757 1439.28 576.546 1339.7 640.472 1216.73L689.705 1226.28V602.493C763.153 617.739 822.702 674.217 853.469 793.126Z"
                    fill="#AF815A" />
                <g id="iPhone 7">
                    <rect id="Rectangle 2" x="0.879517" y="179.361" width="18.8801" height="61.3603" rx="4.72002"
                        fill="#313131" />
                    <rect id="Rectangle 3" x="0.879517" y="302.082" width="18.8801" height="103.841" rx="9.44005"
                        fill="#313131" />
                    <rect id="Rectangle 5" x="704.163" y="302.082" width="18.8801" height="103.841" rx="9.44005"
                        fill="#313131" />
                    <rect id="Rectangle 4" x="0.879517" y="434.242" width="18.8801" height="103.841" rx="9.44005"
                        fill="#313131" />
                    <rect id="Rectangle 6" x="302.961" y="84.9606" width="118.001" height="14.1601" rx="7.08004"
                        fill="#6A6A6A" />
                    <circle id="Ellipse 1" cx="248.681" cy="92.0405" r="11.8001" fill="#161519" />
                    <circle id="Ellipse 2" cx="359.601" cy="1349.93" r="56.6403" fill="#1F1F1F" />
                    <path id="Subtract" fill-rule="evenodd" clip-rule="evenodd"
                        d="M114.16 0C54.2037 0 5.59949 48.6044 5.59949 108.561L5.59949 1345.21C5.59949 1405.16 54.2036 1453.77 114.16 1453.77H609.763C669.719 1453.77 718.323 1405.16 718.323 1345.21L718.323 108.561C718.323 48.6042 669.719 0 609.763 0L114.16 0ZM666.403 179.361L57.5198 179.361L57.5198 1264.97H666.403L666.403 179.361Z"
                        fill="#1A1A1A" />
                    <rect id="Rectangle 8" x="57.8187" y="179.15" width="608.277" height="123.6" fill="black"
                        fill-opacity="0.2" />
                    <rect id="Rectangle 9" x="57.8187" y="1042.96" width="608.277" height="222.202" fill="black" />
                </g>
                <path id="Vector 28"
                    d="M287.108 1213.23L731.859 1689.09L940.212 1523.42C905.486 1415.32 752.694 1174.45 419.331 1075.76C85.9683 977.058 192.281 1126.28 287.108 1213.23Z"
                    fill="#AF815A" />
                <path id="Vector 29" d="M1267.5 1397.91L906.846 1843.01L1737.43 2573.25V1743.66L1267.5 1397.91Z"
                    fill="#D62246" />
            </g>
        </svg>

        <svg id="leftHand2" width="1522" height="1700" viewBox="0 0 1522 1700" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <g id="left hand">
                <path id="hand"
                    d="M924.221 883.77C844.329 942.349 626.41 1261.45 611.871 1336.77L311.734 1170.05L402.221 827.367C413.763 738.947 367.249 498.318 402.221 428.617C433.091 367.092 470.552 361.33 505.975 370.19C514.661 355.977 634.757 312.468 662.197 350.302C686.004 327.551 795.12 318.272 792.6 364.662C860.268 236.891 893.135 172.203 982.686 65.4047C1036.03 1.78013 1148.57 -16.1227 1097.39 126.204C1033.83 302.912 1049.06 267.467 982.686 415.678C897.065 606.877 935.631 615.5 1110.81 542.322C1153.37 524.544 1156.39 498.389 1206.14 498.389C1251.15 498.389 1299.9 531.175 1200.39 633.42C1077.95 759.236 1021.87 812.175 924.221 883.77Z"
                    fill="#A07047" />
                <path id="Vector 30"
                    d="M352.004 947.386L639.418 1335.87L530.453 1699.08L19.4427 1620.51L352.004 947.386Z"
                    fill="#D62246" />
            </g>
        </svg>

    </main>
            <nav>
                Please align your device with the ground and tap your screen to continue.
                <div>
                    <button data-ref="calib_continue2">Continue</button>
                </div>
            </nav>
        </section>
    </div>
    <video data-ref="camera2" autoplay playsinline webkit-playsinline muted></video>
</div>
`,
    init:(compass_service, location_service)=>{
        let initial_state = compass_service.getOrientation().getLastRawEventData();
        const anim_time = 200;
        document.querySelector(`[data-ref="calib_continue1"]`).addEventListener("click", ()=>{
            document.querySelector(`[data-ref="camera1"]`).setAttribute("visible", true)

            navigator.mediaDevices
                .getUserMedia(constraints)
                .then((mediaStream) => {
                    const video = document.querySelector(`[data-ref="camera1"]`);
                    const video2 = document.querySelector(`[data-ref="camera2"]`);
                    cameraStream = mediaStream;
                    video.srcObject = cameraStream;
                    video.onloadedmetadata = () => {
                        let promise = video.play();

                        if (promise !== undefined) {
                            promise.catch(error => {
                                logger.error(error, "CALIBRATION_PAGE")
                                // Auto-play was prevented
                                // Show a UI element to let the user manually start playback
                                video.setAttribute("controls", "true");
                            }).then(() => {
                                camera_support = true;
                            });
                        }        };
                    video2.srcObject = cameraStream;
                    video2.onloadedmetadata = () => {
                        let promise = video2.play();

                        if (promise !== undefined) {
                            promise.catch(error => {
                                logger.error(error, "CALIBRATION_PAGE")
                                // Auto-play was prevented
                                // Show a UI element to let the user manually start playback
                                video.setAttribute("controls", "true");
                            }).then(() => {
                                camera_support = true;
                            });
                        }        };
                })
                .catch((err) => {
                    // always check for errors at the end.
                    logger.error(err, "CALIBRATION_PAGE")
                });

            setTimeout(()=>{
                document.querySelector(`[data-ref="slide1"]`).setAttribute("visible", false)
            }, anim_time)
        })
        document.querySelector(`[data-ref="camera1"]`).addEventListener("click", ()=>{
            compass_service.set_heading_offset(-(360-compass_service?.getOrientation().getFixedFrameEuler().alpha) + sun_pos(location_service.getLocation().coords).azimuth);

            document.querySelector(`[data-ref="slide2"]`).setAttribute("visible", true)
            setTimeout(()=>{
                document.querySelector(`[data-ref="camera1"]`).setAttribute("visible", false)
            }, anim_time)
        })
        document.querySelector(`[data-ref="calib_continue2"]`).addEventListener("click", ()=>{
            document.querySelector(`[data-ref="camera2"]`).setAttribute("visible", true)
            setTimeout(()=>{
                document.querySelector(`[data-ref="slide2"]`).setAttribute("visible", false)
            }, anim_time)
        })
        document.querySelector(`[data-ref="camera2"]`).addEventListener("click", ()=>{
            // Calibrate Floor
            compass_service.set_tilt_offset(compass_service?.getOrientation().getFixedFrameEuler().beta + 90);

            document.querySelector(`.calibrate-slider`).setAttribute("visible", false)
            setTimeout(()=>{
                const video = document.querySelector(`[data-ref="camera1"]`);
                const video2 = document.querySelector(`[data-ref="camera2"]`);
                cameraStream?.getTracks().forEach(function(track) {
                    track.stop();
                });
                video.srcObject = null;
                video.pause();
                video2.srcObject = null;
                video2.pause();
                video2.setAttribute("visible", false);
            }, anim_time)
        })
    }
}

let cameraStream = null;

const constraints = {
    audio: false,
    video: { width: {ideal: screen.height}, height: {ideal: screen.width}, facingMode: { ideal: "environment" }},
};



const RAD = Math.PI / 180
const DEG = 180 / Math.PI
function sun_pos(location) {
    const time = new Date();
    const longitude_deg = location.longitude;
    const latitude_deg = location.latitude;
    const year = time.getFullYear();
    const hour = time.getHours();
    const minute = time.getMinutes();
    const sec = time.getSeconds();
    const start = new Date(year, 0, 0);
    const diff = time - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const day_of_year = Math.floor(diff / oneDay);
    const days_in_year = ((0 === year % 4) && (0 !== year % 100) || (0 === year % 400)) ? 366 : 365;

    let altitude = Number.NaN;
    let azimuth = Number.NaN;

    let frac_year = (2*Math.PI)/(days_in_year) *  (day_of_year - 1 + (hour-12)/24)

    let equi_time = 229.18 * (0.000075 + 0.001868*Math.cos(frac_year) - 0.032077*Math.sin(frac_year) - 0.014615 * Math.cos(2*frac_year) - 0.040849*Math.sin(2*frac_year));

    let decl = 0.006918 - 0.399912*Math.cos(frac_year) + 0.070257*Math.sin(frac_year) - 0.00675*Math.cos(2*frac_year) + 0.000907 * Math.sin(2 * frac_year) - 0.002697*Math.cos(3 * frac_year) + 0.00148 * Math.sin(3 * frac_year);

    let time_offset = equi_time + 4*longitude_deg - 60*(time.getTimezoneOffset())

    let tst = hour * 60 + minute + sec/60 + time_offset;

    let hour_angle = tst / 4 - 180;

    let zenith = Math.acos(Math.sin(latitude_deg * RAD)*Math.sin(decl) + Math.cos(latitude_deg * RAD)*Math.cos(decl)*Math.cos(hour_angle * RAD));

    azimuth = 180 + Math.acos((Math.sin(latitude_deg * RAD)*Math.cos(zenith) - Math.sin((decl))) / (Math.cos(latitude_deg * RAD) * Math.sin(zenith))) * DEG

    altitude = 90 - zenith * DEG
    // Return altitude and azimuth
    return {altitude, azimuth};
}