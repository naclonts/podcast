'use strict';
//
// To do:
// - add listener to seeker to change location
// - update seeker position every few seconds

/* global d3, document */
var playButton = {
    button: document.querySelector('.js-button'),
    audio: document.getElementById('player-audio'),
    ctx: document.getElementById('seeker-canvas').getContext('2d'),
    seeker: document.getElementById('seeker-input'),

    states: {
        playing: {
            nextState: 'paused',
            iconEl: document.querySelector('#pause-icon')
        },
        paused:  {
            nextState: 'playing',
            iconEl: document.querySelector('#play-icon')
        }
    },

    animationDuration: 350, // Duration of play/pause button transition
    seekerUpdateFrequency: 1000, // Interval in ms to update seeker position
    intervalID: 0,
    seekInProgress: false,

    init: function () {
        this.setInitialState();
        this.replaceUseElement();
        this.drawSeeker();

        // Play/pause button click
        this.button.addEventListener('click', this.goToNextState.bind(this));

        // Update audio seeker as playback progresses
        this.intervalID = setInterval(this.updatePosition.bind(this),
                                      this.seekerUpdateFrequency);

        // Moving audio position
        this.seeker.addEventListener('mouseup', this.setPosition.bind(this));
        this.seeker.addEventListener('touchend', this.setPosition.bind(this));

        var setSeek = function (e) {
            this.seekInProgress = true;
        };
        // Record when user is seeking
        this.seeker.addEventListener('mousedown', setSeek.bind(this));
        this.seeker.addEventListener('touchstart', setSeek.bind(this));
    },

    setInitialState: function () {
        var b = this.button;
        var initialIconRef = b.querySelector('use').getAttribute('xlink:href');
        var stateName = b.querySelector(initialIconRef).getAttribute('data-state');
        this.setState(stateName);
    },

    replaceUseElement: function () {
        d3.select(this.button.querySelector('use')).remove();
        d3.select(this.button.querySelector('svg')).append('path')
            .attr('class', 'js-icon')
            .attr('d', this.stateIconPath());
    },


    // Alternate between Play and Pause icons
    // @param {string} newState defaults to toggle if not specified
    goToNextState: function (e, newState) {
        if (!newState) newState = this.state.nextState;
        this.setState(newState);
        d3.select(this.button.querySelector('.js-icon')).transition()
            .duration(this.animationDuration)
            .attr('d', this.stateIconPath());

        if (newState == 'playing') {
            this.audio.play();
        } else {
            this.audio.pause();
        }
    },

    setState: function (stateName) {
        this.state = this.states[stateName];
    },

    stateIconPath: function () {
        return this.state.iconEl.getAttribute('d');
    },

    // Move seeker input as playback progresses
    updatePosition: function (e) {
        // While mouse is being held down, don't move back to current position
        if (this.seekInProgress) return;

        var newPosition = this.audio.currentTime / this.audio.duration;

        // At end of track, set icon to pause
        if (newPosition == 1) {
            this.goToNextState(null, 'paused');
        }
        this.seeker.value = newPosition;
    },

    // Update position of playback on release of seeker input range
    setPosition: function (e) {
        // seeker.value ranges between 0 (beginning of audio) and 1 (end)
        var newTime = this.seeker.value * this.audio.duration;
        this.audio.currentTime = newTime;

        // done seeking
        this.seekInProgress = false;
    },

    // Draw sin wave background for seeker
    drawSeeker: function () {
        var w = this.ctx.canvas.width;
        var h = this.ctx.canvas.height;
        var mid = h / 2;
        var amp = h / 2.5;

        this.ctx.moveTo(0, mid);
        for (var x=0; x < 360; x++) {
            var y = mid + Math.sin(x*Math.PI / 30) * amp;
            this.ctx.lineTo(Math.round(x), Math.round(y));
        }
        this.ctx.strokeStyle = 'hsl(300, 10%, 35%)';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
    }
};

window.addEventListener('load', function (e) {
    if (window.HTMLAudioElement) {
        playButton.init();
    }
});
