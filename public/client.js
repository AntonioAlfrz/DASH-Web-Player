// Example video
var url_file = "http://dash.edgesuite.net/akamai/bbb_30fps/bbb_30fps.mpd";

var player, vmetrics, ametrics, vSwitch, aSwitch, dashMetrics, streamInfo;
var flag = false;
var vbitRateText = document.getElementById("vbitrate");
var vbufferText = document.getElementById("vbuffer");
var abitRateText = document.getElementById("abitrate");
var abufferText = document.getElementById("abuffer");
var vRepr = document.querySelector("#vrepresentation");
var aRepr = document.querySelector("#arepresentation");
var url = document.querySelector("#input");

var player = dashjs.MediaPlayer().create();

function setUrl(streaming) {
    if (streaming && url.value == '') {
        alert("URL is empty");
        return;
    }
    var url_temp = streaming ? url.value : url_file;
    if (player.isReady()) {
        console.log("Player ready");
        player.attachSource(url_temp);
        flag = false;
    } else {
        console.log("Player initialized")
        player.initialize(document.querySelector("#streaming"), url_temp, true);
    }

    player.setInitialMediaSettingsFor("video");
    player.setInitialMediaSettingsFor("audio");
    player.on(dashjs.MediaPlayer.events.PERIOD_SWITCH_COMPLETED, switch_completed);
    player.on(dashjs.MediaPlayer.events.STREAM_INITIALIZED, function () { flag = true });
    player.on(dashjs.MediaPlayer.events.METRICS_CHANGED, metrics_changed);
}

function switch_completed(e) {
    streamInfo = e.toStreamInfo;
}
function metrics_changed(e) {
    if (!flag || typeof streamInfo == 'undefined') return;
    dashMetrics = player.getDashMetrics();
    vmetrics = player.getMetricsFor("video");
    ametrics = player.getMetricsFor("audio");
    vSwitch = dashMetrics.getCurrentRepresentationSwitch(vmetrics);
    vRepr.innerHTML = vSwitch.to;
    aSwitch = dashMetrics.getCurrentRepresentationSwitch(ametrics);
    aRepr.innerHTML = aSwitch.to;
    vbitRateText.innerHTML = Math.round(dashMetrics.getBandwidthForRepresentation(vSwitch.to, streamInfo.index) / 1000);
    vbufferText.innerHTML = dashMetrics.getCurrentBufferLevel(vmetrics);
    abitRateText.innerHTML = Math.round(dashMetrics.getBandwidthForRepresentation(aSwitch.to, streamInfo.index) / 1000);
    abufferText.innerHTML = dashMetrics.getCurrentBufferLevel(ametrics);

}


