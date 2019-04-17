FROM microsoft/dotnet:2.2-runtime AS base
WORKDIR /app

FROM microsoft/dotnet:2.2-sdk AS build
WORKDIR /src
COPY DemoPlayer/DemoPlayer.csproj DemoPlayer/
COPY AbundantMusic.NET/AbundantMusic.NET.csproj AbundantMusic.NET/
RUN dotnet restore DemoPlayer/DemoPlayer.csproj
COPY . .
WORKDIR /src/DemoPlayer
RUN dotnet build DemoPlayer.csproj -c Release -o /app

FROM build AS publish
RUN dotnet publish DemoPlayer.csproj -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "DemoPlayer.dll"]
