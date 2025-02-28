function timeRunning(start_time: Date | null){
    if(!start_time) return '00:00';

    const totalSec = getTimeDiffInSeconds(start_time, new Date());

    const hours = Math.floor(totalSec / 60 / 60);
    const hh = ('0' + hours).slice(-2);

    const minutes = Math.floor((totalSec - 60*60*hours) / 60);
    const mm = ('0' + minutes).slice(-2);

    const seconds = Math.floor((totalSec - 60*60*hours - 60*minutes));
    const ss = ('0' + seconds).slice(-2);

    if(hh != '00') return `${hh}:${mm}:${ss}`;
    return `${mm}:${ss}`;
}

function getTimeDiffInSeconds(start_date: Date, final_date: Date) {
    return (final_date.getTime() - start_date.getTime()) / 1000
}

export { timeRunning }