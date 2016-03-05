FROM ubuntu:trusty

ADD . /app
WORKDIR /app

RUN apt-get update && \
    apt-get install -yq ruby ruby-dev build-essential git && \
    gem install --no-ri --no-rdoc bundler && \
    rm -fr /var/lib/apt/lists/* && \
    bundle install

EXPOSE 4567

CMD ["bundle", "exec", "middleman", "server"]
