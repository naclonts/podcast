'use strict';
//
// To do:
// - add listener to seeker to change location
// - update seeker position every few seconds

/* global d3, document */
var playButton = {
    el: document.querySelector('.js-button'),
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

    animationDuration: 350,

    init: function () {
        this.setInitialState();
        this.replaceUseEl();
        this.drawSeeker();
        this.el.addEventListener('click', this.goToNextState.bind(this));
        this.seeker.addEventListener('mouseup', this.updatePosition.bind(this));
        this.seeker.addEventListener('touchend', this.updatePosition.bind(this));
    },

    setInitialState: function () {
      var initialIconRef = this.el.querySelector('use').getAttribute('xlink:href');
      var stateName = this.el.querySelector(initialIconRef).getAttribute('data-state');
      this.setState(stateName);
    },

    replaceUseEl: function () {
        d3.select(this.el.querySelector('use')).remove();
        d3.select(this.el.querySelector('svg')).append('path')
            .attr('class', 'js-icon')
            .attr('d', this.stateIconPath());
    },

    // Alternate between Play and Pause icons
    goToNextState: function () {
        this.setState(this.state.nextState);

        d3.select(this.el.querySelector('.js-icon')).transition()
            .duration(this.animationDuration)
            .attr('d', this.stateIconPath());

        if (this.audio.paused) {
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

    // Update position of playback on release of input range
    updatePosition: function (e) {
        // seeker.value ranges between 0 (beginning of audio) and 1 (end)
        var newTime = this.seeker.value * this.audio.duration;
        this.audio.currentTime = newTime;
    },

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

window.addEventListener('load', function(e) {
    if (window.HTMLAudioElement) {
        playButton.init();
    }
});
