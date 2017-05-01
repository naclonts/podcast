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

    drawSeeker: function () {
        var w = this.ctx.canvas.width;
        var h = this.ctx.canvas.height;
        var mid = h / 2;
        var amp = h / 2.2;

        this.ctx.moveTo(0, mid);
        for (var x=0; x < 360; x++) {
            var y = mid + Math.sin(x*Math.PI / 30) * amp;
            this.ctx.lineTo(x, y);
        }
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
    }
};

window.addEventListener('load', function(e) {
    if (window.HTMLAudioElement) {
        playButton.init();
    }
});
