FROM balenalib/raspberrypi3-debian:bullseye

RUN install_packages alsa-utils

COPY init-audio.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/init-audio.sh

CMD ["/usr/local/bin/init-audio.sh"]
